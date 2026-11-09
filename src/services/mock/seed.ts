import type { Field, Planting, Sensor } from '@/types/domain';
import { IDS } from './ids';
import { buildLatest, toSnapshot } from './readings';
import type { AlertRecord, DeviceRecord, PropertyRecord, UserRecord } from './types';

/** Credenciais do usuário de demonstração (existem só no mock). */
export const DEMO_CREDENTIALS = {
  email: 'demo@agroconnect.com',
  password: 'Demo@1234',
} as const;

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;

function iso(ms: number): string {
  return new Date(ms).toISOString();
}

function sensorsFor(deviceId: string, ids: [string, string, string]): Sensor[] {
  return [
    { id: ids[0], deviceId, type: 'SOIL_MOISTURE', label: 'Umidade do solo', unit: '%' },
    { id: ids[1], deviceId, type: 'AIR_TEMPERATURE', label: 'Temperatura do ar', unit: '°C' },
    { id: ids[2], deviceId, type: 'AIR_HUMIDITY', label: 'Umidade do ar', unit: '%' },
  ];
}

export function createSeedData(nowMs: number) {
  const users: UserRecord[] = [
    {
      id: IDS.userDemo,
      name: 'Produtor Demo',
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
      createdAt: iso(nowMs - 60 * DAY_MS),
    },
  ];

  const properties: PropertyRecord[] = [
    {
      id: IDS.property1,
      ownerId: IDS.userDemo,
      name: 'Sítio Boa Esperança',
      city: 'Ibiúna',
      state: 'SP',
      areaHectares: 3.5,
      description: 'Propriedade de demonstração com hortaliças (dados simulados).',
      createdAt: iso(nowMs - 45 * DAY_MS),
      updatedAt: iso(nowMs - 45 * DAY_MS),
    },
  ];

  const fields: Field[] = [
    { id: IDS.field1, propertyId: IDS.property1, name: 'Canteiro de Alface', areaHectares: 1.2 },
    { id: IDS.field2, propertyId: IDS.property1, name: 'Canteiro de Rúcula', areaHectares: 0.8 },
  ];

  const plantings: Planting[] = [
    {
      id: IDS.planting1,
      fieldId: IDS.field1,
      cropName: 'Alface crespa',
      plantedAt: iso(nowMs - 28 * DAY_MS),
      stage: 'VEGETATIVE',
    },
    {
      id: IDS.planting2,
      fieldId: IDS.field2,
      cropName: 'Rúcula',
      plantedAt: iso(nowMs - 14 * DAY_MS),
      stage: 'SEEDLING',
    },
  ];

  const devices: DeviceRecord[] = [
    {
      id: IDS.device1,
      code: 'ESP32-001',
      name: 'Sensor do Canteiro de Alface',
      fieldId: IDS.field1,
      rssi: -61,
      firmwareVersion: '1.0.0',
    },
    {
      id: IDS.device2,
      code: 'ESP32-002',
      name: 'Sensor do Canteiro de Rúcula',
      fieldId: IDS.field2,
      rssi: null,
      firmwareVersion: '1.0.0',
    },
  ];

  const sensors: Sensor[] = [
    ...sensorsFor(IDS.device1, [IDS.soil1, IDS.temp1, IDS.hum1]),
    ...sensorsFor(IDS.device2, [IDS.soil2, IDS.temp2, IDS.hum2]),
  ];

  const latest = buildLatest(
    IDS.device1,
    sensors.filter((s) => s.deviceId === IDS.device1),
    nowMs,
  );
  const soil = latest.readings.find((r) => r.type === 'SOIL_MOISTURE');
  const soilText = soil?.value != null ? `${soil.value}${soil.unit}` : 'indisponível';

  const alerts: AlertRecord[] = [
    {
      id: IDS.alert1,
      ownerId: IDS.userDemo,
      deviceId: IDS.device1,
      severity: 'WARNING',
      status: 'UNREAD',
      title: 'Umidade do solo abaixo do esperado',
      message: 'A última leitura de umidade do solo ficou abaixo do limite de demonstração.',
      reason: `Leitura de ${soilText} (limite de demonstração: 30%). Os limites reais variam por cultura, fase e solo.`,
      basedOn: soil ? [toSnapshot(soil)] : [],
      createdAt: iso(nowMs - 20 * MINUTE_MS),
    },
    {
      id: IDS.alert2,
      ownerId: IDS.userDemo,
      deviceId: IDS.device2,
      severity: 'WARNING',
      status: 'UNREAD',
      title: 'Dispositivo sem comunicação recente',
      message: 'O sensor do Canteiro de Rúcula não envia dados há várias horas.',
      reason: 'Última comunicação há mais de 8 horas. Os valores exibidos podem estar defasados.',
      basedOn: [],
      createdAt: iso(nowMs - 8 * HOUR_MS),
    },
    {
      id: IDS.alert3,
      ownerId: IDS.userDemo,
      deviceId: IDS.device1,
      severity: 'INFO',
      status: 'RESOLVED',
      title: 'Falha temporária no sensor de umidade do ar',
      message: 'O sensor ficou sem medir por cerca de uma hora e voltou ao normal.',
      reason: 'Leituras com qualidade SENSOR_ERROR no período, sem valor registrado.',
      basedOn: [],
      createdAt: iso(nowMs - 49 * HOUR_MS),
    },
  ];

  return { users, properties, fields, plantings, devices, sensors, alerts };
}