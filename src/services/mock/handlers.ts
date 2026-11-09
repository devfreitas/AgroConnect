import type { ApiErrorBody, Page } from '@/types/api';
import type {  Alert,  AlertSeverity,  AuthResponse,  Field,  HistoryInterval,  Planting,   PlantingStage,  PropertyInput,  Recommendation } from '@/types/domain';
import {  db,  findOwnedDevice,  findOwnedField,  findOwnedProperty,  makeToken,  newId,  ownedFieldIds,  removePropertyCascade,  toDevice,  toPublicProperty,  toPublicUser,  userIdFromToken } from './db';
import { buildHistory, buildLatest, toSnapshot } from './readings';
import type { UserRecord } from './types';

export class HttpError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
    this.status = status;
    this.body = { code, message, details, timestamp: new Date().toISOString() };
  }
}

type RequestContext = {
  params: Record<string, string>;
  query: Record<string, string>;
  body: Record<string, unknown>;
  /** Vazio nas rotas públicas. */
  userId: string;
};

type Result = { status: number; data: unknown };
type Handler = (ctx: RequestContext) => Result;
type Route = { method: string; regex: RegExp; keys: string[]; auth: boolean; handler: Handler };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STAGES: PlantingStage[] = ['SEEDLING', 'VEGETATIVE', 'MATURATION', 'HARVEST'];
const INTERVALS: HistoryInterval[] = ['raw', '5m', '15m', '1h', '1d'];
const SEVERITY_RANK: Record<AlertSeverity, number> = { CRITICAL: 3, WARNING: 2, INFO: 1 };
const DAY_MS = 86_400_000;

/** Limite usado SOMENTE na demonstração. Os limites reais virão do time de IoT/IoB. */
const MOCK_MIN_SOIL_MOISTURE = 30;

const AI_DISCLAIMER =
  'Recomendação informativa baseada em dados simulados. Avalie as condições reais antes de decidir.';

const routes: Route[] = [];

function add(method: string, path: string, handler: Handler, auth = true): void {
  const keys: string[] = [];
  const pattern = path.replace(/:([a-zA-Z]+)/g, (_match, key: string) => {
    keys.push(key);
    return '([^/]+)';
  });
  routes.push({ method, regex: new RegExp(`^${pattern}$`), keys, auth, handler });
}

function ok(data: unknown, status = 200): Result {
  return { status, data };
}

function noContent(): Result {
  return { status: 204, data: undefined };
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function validationError(details: Record<string, string>): HttpError {
  return new HttpError(422, 'VALIDATION_ERROR', 'Os dados enviados são inválidos.', details);
}

function notFound(what: string): HttpError {
  return new HttpError(404, 'NOT_FOUND', `${what} não encontrado.`);
}

function paginate<T>(items: T[], query: Record<string, string>): Page<T> {
  const size = clamp(parseInt(query.size ?? '', 10) || 20, 1, 100);
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / size));
  const number = clamp(parseInt(query.page ?? '', 10) || 1, 1, totalPages);
  const start = (number - 1) * size;

  return {
    items: items.slice(start, start + size),
    page: { number, size, totalItems, totalPages },
  };
}

function authResponse(user: UserRecord): AuthResponse {
  return {
    accessToken: makeToken(user.id),
    tokenType: 'Bearer',
    expiresIn: 3600,
    user: toPublicUser(user),
  };
}

function requireUser(authorization: string): string {
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const userId = userIdFromToken(token);
  if (!userId) {
    throw new HttpError(401, 'UNAUTHORIZED', 'Sua sessão expirou. Entre novamente.');
  }
  return userId;
}

function parsePropertyInput(body: Record<string, unknown>, partial: boolean): Partial<PropertyInput> {
  const errors: Record<string, string> = {};
  const out: Partial<PropertyInput> = {};

  if (!partial || 'name' in body) {
    const name = str(body.name);
    if (name.length < 2) errors.name = 'Informe o nome da propriedade.';
    else out.name = name;
  }

  if (!partial || 'city' in body) {
    const city = str(body.city);
    if (city.length < 2) errors.city = 'Informe a cidade.';
    else out.city = city;
  }

  if (!partial || 'state' in body) {
    const state = str(body.state).toUpperCase();
    if (!/^[A-Z]{2}$/.test(state)) errors.state = 'Informe a sigla do estado (ex.: SP).';
    else out.state = state;
  }

  if (!partial || 'areaHectares' in body) {
    const area = body.areaHectares;
    if (typeof area !== 'number' || !Number.isFinite(area) || area <= 0) {
      errors.areaHectares = 'Informe uma área maior que zero.';
    } else {
      out.areaHectares = area;
    }
  }

  if ('description' in body) {
    out.description = str(body.description) || null;
  }

  if (Object.keys(errors).length > 0) throw validationError(errors);
  return out;
}

function isInterval(value: string): value is HistoryInterval {
  return (INTERVALS as string[]).includes(value);
}

function isStage(value: string): value is PlantingStage {
  return (STAGES as string[]).includes(value);
}

//  Utilitários 

add('GET', '/health', () => ok({ status: 'ok', mock: true }), false);

//  Autenticação 

add(
  'POST',
  '/auth/register',
  ({ body }) => {
    const errors: Record<string, string> = {};
    const name = str(body.name);
    const email = str(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';

    if (name.length < 2) errors.name = 'Informe seu nome.';
    if (!EMAIL_RE.test(email)) errors.email = 'Informe um e-mail válido.';
    if (password.length < 8) errors.password = 'A senha deve ter ao menos 8 caracteres.';
    if (Object.keys(errors).length > 0) throw validationError(errors);

    if (db.users.some((user) => user.email === email)) {
      throw new HttpError(409, 'EMAIL_IN_USE', 'Este e-mail já está cadastrado.');
    }

    const user: UserRecord = {
      id: newId(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    return ok(authResponse(user), 201);
  },
  false,
);

add(
  'POST',
  '/auth/login',
  ({ body }) => {
    const email = str(body.email).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const user = db.users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new HttpError(401, 'INVALID_CREDENTIALS', 'E-mail ou senha inválidos.');
    }
    return ok(authResponse(user));
  },
  false,
);

add('GET', '/auth/me', ({ userId }) => {
  const user = db.users.find((u) => u.id === userId);
  if (!user) throw new HttpError(401, 'UNAUTHORIZED', 'Sua sessão expirou. Entre novamente.');
  return ok(toPublicUser(user));
});

add('POST', '/auth/logout', () => noContent());

//  Propriedades (CRUD completo) 

add('GET', '/properties', ({ userId, query }) => {
  const items = db.properties
    .filter((p) => p.ownerId === userId)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(toPublicProperty);
  return ok(paginate(items, query));
});

add('POST', '/properties', ({ userId, body }) => {
  const input = parsePropertyInput(body, false);
  const now = new Date().toISOString();

  const record = {
    id: newId(),
    ownerId: userId,
    name: input.name ?? '',
    city: input.city ?? '',
    state: input.state ?? '',
    areaHectares: input.areaHectares ?? 0,
    description: input.description ?? null,
    createdAt: now,
    updatedAt: now,
  };
  db.properties.push(record);
  return ok(toPublicProperty(record), 201);
});

add('GET', '/properties/:id', ({ userId, params }) => {
  const property = findOwnedProperty(userId, params.id ?? '');
  if (!property) throw notFound('Propriedade');
  return ok(toPublicProperty(property));
});

add('PATCH', '/properties/:id', ({ userId, params, body }) => {
  const property = findOwnedProperty(userId, params.id ?? '');
  if (!property) throw notFound('Propriedade');

  const input = parsePropertyInput(body, true);
  Object.assign(property, input, { updatedAt: new Date().toISOString() });
  return ok(toPublicProperty(property));
});

add('DELETE', '/properties/:id', ({ userId, params }) => {
  const property = findOwnedProperty(userId, params.id ?? '');
  if (!property) throw notFound('Propriedade');

  removePropertyCascade(property.id);
  return noContent();
});

//  Talhões e plantios 

add('GET', '/properties/:id/fields', ({ userId, params, query }) => {
  const property = findOwnedProperty(userId, params.id ?? '');
  if (!property) throw notFound('Propriedade');

  return ok(paginate(db.fields.filter((f) => f.propertyId === property.id), query));
});

add('POST', '/properties/:id/fields', ({ userId, params, body }) => {
  const property = findOwnedProperty(userId, params.id ?? '');
  if (!property) throw notFound('Propriedade');

  const errors: Record<string, string> = {};
  const name = str(body.name);
  const area = body.areaHectares;
  if (name.length < 2) errors.name = 'Informe o nome do talhão.';
  if (typeof area !== 'number' || !Number.isFinite(area) || area <= 0) {
    errors.areaHectares = 'Informe uma área maior que zero.';
  }
  if (Object.keys(errors).length > 0) throw validationError(errors);

  const field: Field = {
    id: newId(),
    propertyId: property.id,
    name,
    areaHectares: area as number,
  };
  db.fields.push(field);
  return ok(field, 201);
});

add('GET', '/fields/:id', ({ userId, params }) => {
  const field = findOwnedField(userId, params.id ?? '');
  if (!field) throw notFound('Talhão');
  return ok(field);
});

add('GET', '/fields/:id/plantings', ({ userId, params, query }) => {
  const field = findOwnedField(userId, params.id ?? '');
  if (!field) throw notFound('Talhão');

  const items = db.plantings
    .filter((p) => p.fieldId === field.id)
    .sort((a, b) => b.plantedAt.localeCompare(a.plantedAt));
  return ok(paginate(items, query));
});

add('POST', '/fields/:id/plantings', ({ userId, params, body }) => {
  const field = findOwnedField(userId, params.id ?? '');
  if (!field) throw notFound('Talhão');

  const errors: Record<string, string> = {};
  const cropName = str(body.cropName);
  const plantedAt = str(body.plantedAt);
  const stage = str(body.stage) || 'SEEDLING';

  if (cropName.length < 2) errors.cropName = 'Informe a cultura.';
  if (!plantedAt || Number.isNaN(Date.parse(plantedAt))) {
    errors.plantedAt = 'Informe uma data de plantio válida.';
  }
  if (!isStage(stage)) errors.stage = 'Fase de desenvolvimento inválida.';
  if (Object.keys(errors).length > 0) throw validationError(errors);

  const planting: Planting = {
    id: newId(),
    fieldId: field.id,
    cropName,
    plantedAt: new Date(plantedAt).toISOString(),
    stage: stage as PlantingStage,
  };
  db.plantings.push(planting);
  return ok(planting, 201);
});

// ---------- Dispositivos, sensores e leituras ----------

add('GET', '/devices', ({ userId, query }) => {
  const owned = ownedFieldIds(userId);
  const items = db.devices
    .filter((d) => owned.has(d.fieldId) && (!query.fieldId || d.fieldId === query.fieldId))
    .map((d) => toDevice(d));
  return ok(paginate(items, query));
});

add('GET', '/devices/:id', ({ userId, params }) => {
  const device = findOwnedDevice(userId, params.id ?? '');
  if (!device) throw notFound('Dispositivo');
  return ok(toDevice(device));
});

add('GET', '/devices/:id/sensors', ({ userId, params, query }) => {
  const device = findOwnedDevice(userId, params.id ?? '');
  if (!device) throw notFound('Dispositivo');
  return ok(paginate(db.sensors.filter((s) => s.deviceId === device.id), query));
});

add('GET', '/devices/:id/readings/latest', ({ userId, params }) => {
  const device = findOwnedDevice(userId, params.id ?? '');
  if (!device) throw notFound('Dispositivo');

  const sensors = db.sensors.filter((s) => s.deviceId === device.id);
  return ok(buildLatest(device.id, sensors));
});

add('GET', '/devices/:id/readings', ({ userId, params, query }) => {
  const device = findOwnedDevice(userId, params.id ?? '');
  if (!device) throw notFound('Dispositivo');

  if (!query.sensorId && !query.type) {
    throw validationError({ type: 'Informe type ou sensorId.' });
  }

  const sensors = db.sensors.filter((s) => s.deviceId === device.id);
  const sensor = query.sensorId
    ? sensors.find((s) => s.id === query.sensorId)
    : sensors.find((s) => s.type === query.type);
  if (!sensor) throw notFound('Sensor');

  const interval = query.interval ?? 'raw';
  if (!isInterval(interval)) {
    throw validationError({ interval: 'Use raw, 5m, 15m, 1h ou 1d.' });
  }

  const now = Date.now();
  const to = query.to ? Date.parse(query.to) : now;
  const from = query.from ? Date.parse(query.from) : to - DAY_MS;
  if (Number.isNaN(from) || Number.isNaN(to) || from > to) {
    throw validationError({ from: 'Período inválido.' });
  }

  return ok(buildHistory(sensor, from, to, interval, now));
});

//  Alertas 

add('GET', '/alerts', ({ userId, query }) => {
  const items: Alert[] = db.alerts
    .filter((a) => a.ownerId === userId && (!query.status || a.status === query.status))
    .map((a) => ({
      id: a.id,
      deviceId: a.deviceId,
      severity: a.severity,
      status: a.status,
      title: a.title,
      message: a.message,
      reason: a.reason,
      basedOn: a.basedOn,
      createdAt: a.createdAt,
    }))
    .sort(
      (a, b) =>
        SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
        b.createdAt.localeCompare(a.createdAt),
    );
  return ok(paginate(items, query));
});

add('PATCH', '/alerts/:id/read', ({ userId, params }) => {
  const alert = db.alerts.find((a) => a.id === params.id && a.ownerId === userId);
  if (!alert) throw notFound('Alerta');

  if (alert.status === 'UNREAD') alert.status = 'READ';
  const { ownerId: _ownerId, ...publicAlert } = alert;
  return ok(publicAlert);
});

//  API de IA: recomendações 

add('POST', '/recommendations', ({ userId, body }) => {
  const deviceId = str(body.deviceId);
  if (!deviceId) throw validationError({ deviceId: 'Informe o dispositivo.' });

  const device = findOwnedDevice(userId, deviceId);
  if (!device) throw notFound('Dispositivo');

  const view = toDevice(device);
  const sensors = db.sensors.filter((s) => s.deviceId === device.id);
  const latest = buildLatest(device.id, sensors);
  const soil = latest.readings.find((r) => r.type === 'SOIL_MOISTURE');
  const generatedAt = new Date().toISOString();
  const base = { id: newId(), generatedAt, disclaimer: AI_DISCLAIMER, simulatedData: true };

  let recommendation: Recommendation;

  if (!soil || latest.recordedAt === null) {
    recommendation = {
      ...base,
      priority: 'INFO',
      title: 'Ainda não há leituras',
      message: 'Este dispositivo ainda não enviou dados para análise.',
      reason: 'Sem leituras disponíveis.',
      basedOn: [],
    };
  } else if (view.status === 'OFFLINE') {
    recommendation = {
      ...base,
      priority: 'INFO',
      title: 'Dados desatualizados',
      message: 'O dispositivo está sem comunicação, então a análise usa a última leitura recebida.',
      reason: `Última comunicação em ${latest.recordedAt}. Verifique o equipamento antes de decidir.`,
      basedOn: [toSnapshot(soil)],
    };
  } else if (soil.value === null || soil.quality === 'SENSOR_ERROR') {
    recommendation = {
      ...base,
      priority: 'INFO',
      title: 'Leitura de umidade indisponível',
      message: 'O sensor de umidade do solo não retornou um valor válido.',
      reason: 'Qualidade da leitura: falha do sensor.',
      basedOn: [toSnapshot(soil)],
    };
  } else {
    const uncalibrated = soil.quality === 'UNCALIBRATED';
    const note = uncalibrated
      ? ' A leitura ainda não foi calibrada, então o valor é uma escala relativa.'
      : '';

    if (soil.value < MOCK_MIN_SOIL_MOISTURE) {
      recommendation = {
        ...base,
        priority: 'WARNING',
        title: 'Umidade do solo abaixo do esperado',
        message: 'A umidade do solo está abaixo do limite configurado. Vale avaliar a irrigação.',
        reason: `Última leitura: ${soil.value}${soil.unit} (limite de demonstração: ${MOCK_MIN_SOIL_MOISTURE}%). Os limites reais variam por cultura, fase e solo.${note}`,
        basedOn: [toSnapshot(soil)],
        disclaimer: `${AI_DISCLAIMER}${note}`,
      };
    } else {
      recommendation = {
        ...base,
        priority: 'INFO',
        title: 'Umidade do solo dentro do esperado',
        message: 'Nenhuma ação é sugerida neste momento.',
        reason: `Última leitura: ${soil.value}${soil.unit} (limite de demonstração: ${MOCK_MIN_SOIL_MOISTURE}%).${note}`,
        basedOn: [toSnapshot(soil)],
        disclaimer: `${AI_DISCLAIMER}${note}`,
      };
    }
  }

  return ok(paginate([recommendation], {}));
});

// ---------- Despacho ----------

export type MockRequest = {
  method: string;
  path: string;
  query: Record<string, string>;
  body: Record<string, unknown>;
  authorization: string;
};

export function handleRequest(request: MockRequest): Result {
  for (const route of routes) {
    if (route.method !== request.method) continue;

    const match = route.regex.exec(request.path);
    if (!match) continue;

    const params: Record<string, string> = {};
    route.keys.forEach((key, index) => {
      params[key] = decodeURIComponent(match[index + 1] ?? '');
    });

    const userId = route.auth ? requireUser(request.authorization) : '';
    return route.handler({ params, query: request.query, body: request.body, userId });
  }

  throw new HttpError(404, 'NOT_FOUND', 'Rota não encontrada.');
}