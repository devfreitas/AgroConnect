import type { HistoryInterval, HistoryPoint,  HistoryResponse,  LatestReadings,  Reading,  ReadingQuality,  ReadingSnapshot,  ReadingType,  Sensor } from '@/types/domain';
import { IDS } from './ids';

const STEP_MS = 15 * 60 * 1000;
const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const MAX_RANGE_MS = 31 * DAY_MS;

/** Âncora fixa da sessão: mantém o histórico estável entre chamadas. */
const ANCHOR_MS = Date.now();

type DeviceSim = {
  seed: number;
  /** Quanto tempo atrás o dispositivo comunicou pela última vez. */
  lastSeenOffsetMs: number;
  soilQuality: ReadingQuality;
};

const SIM: Record<string, DeviceSim> = {
  [IDS.device1]: { seed: 1, lastSeenOffsetMs: 0, soilQuality: 'VALID' },
  [IDS.device2]: { seed: 2, lastSeenOffsetMs: 9 * HOUR_MS, soilQuality: 'UNCALIBRATED' },
};

const INTERVAL_MS: Record<HistoryInterval, number> = {
  raw: STEP_MS,
  '5m': STEP_MS,
  '15m': STEP_MS,
  '1h': HOUR_MS,
  '1d': DAY_MS,
};

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Ruído determinístico entre -1 e 1. */
function noise(seed: number, index: number): number {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function valueAt(type: ReadingType, ts: number, seed: number): number {
  const date = new Date(ts);
  const hourOfDay = date.getHours() + date.getMinutes() / 60;
  const wave = Math.sin(((hourOfDay - 9) / 24) * 2 * Math.PI);
  const n = noise(seed, ts / STEP_MS);

  switch (type) {
    case 'SOIL_MOISTURE': {
      // Secagem gradual até o "agora" (chuva ou irrigação reinicia a curva a cada 72 h).
      const hoursAgo = Math.max(0, (ANCHOR_MS - ts) / HOUR_MS);
      const phase = hoursAgo % 72;
      return round1(24 + (phase / 72) * 18 + n * 0.6);
    }
    case 'AIR_TEMPERATURE':
      return round1(24 + 6 * wave + n * 0.4);
    case 'AIR_HUMIDITY':
      return round1(clamp(65 - 18 * wave + n * 1.5, 20, 100));
    case 'LIGHT_ILLUMINANCE': {
      const day = Math.sin(((hourOfDay - 6) / 12) * Math.PI);
      return Math.round(Math.max(0, day) * 800);
    }
  }
}

/** Lacuna simulada: o dispositivo 1 ficou sem enviar dados entre 26 h e 30 h atrás. */
function isInGap(deviceId: string, ts: number): boolean {
  if (deviceId !== IDS.device1) return false;
  const hoursAgo = (ANCHOR_MS - ts) / HOUR_MS;
  return hoursAgo >= 26 && hoursAgo < 30;
}

function buildReading(sensor: Sensor, ts: number, sim: DeviceSim): Reading {
  const recordedAt = new Date(ts).toISOString();
  const hoursAgo = (ANCHOR_MS - ts) / HOUR_MS;

  // Falha simulada do sensor de umidade do ar, 49 h a 50 h atrás.
  if (sensor.type === 'AIR_HUMIDITY' && hoursAgo >= 49 && hoursAgo < 50) {
    return {
      sensorId: sensor.id,
      type: sensor.type,
      value: null,
      unit: sensor.unit,
      quality: 'SENSOR_ERROR',
      recordedAt,
    };
  }

  return {
    sensorId: sensor.id,
    type: sensor.type,
    value: valueAt(sensor.type, ts, sim.seed),
    unit: sensor.unit,
    quality: sensor.type === 'SOIL_MOISTURE' ? sim.soilQuality : 'VALID',
    recordedAt,
  };
}

/** Instante (ms) da última comunicação do dispositivo, ou null se desconhecido. */
export function getLastSeenMs(deviceId: string, nowMs: number = Date.now()): number | null {
  const sim = SIM[deviceId];
  if (!sim) return null;
  return Math.floor((nowMs - sim.lastSeenOffsetMs) / STEP_MS) * STEP_MS;
}

export function toSnapshot(reading: Reading): ReadingSnapshot {
  return {
    type: reading.type,
    value: reading.value,
    unit: reading.unit,
    recordedAt: reading.recordedAt,
  };
}

export function buildLatest(
  deviceId: string,
  sensors: Sensor[],
  nowMs: number = Date.now(),
): LatestReadings {
  const sim = SIM[deviceId];
  const lastSeen = getLastSeenMs(deviceId, nowMs);

  if (!sim || lastSeen === null) {
    return { deviceId, recordedAt: null, readings: [], simulatedData: true };
  }

  return {
    deviceId,
    recordedAt: new Date(lastSeen).toISOString(),
    readings: sensors.map((sensor) => buildReading(sensor, lastSeen, sim)),
    simulatedData: true,
  };
}

function generateSeries(
  sensor: Sensor,
  fromMs: number,
  toMs: number,
  nowMs: number,
): Reading[] {
  const sim = SIM[sensor.deviceId];
  if (!sim) return [];

  const lastSeen = getLastSeenMs(sensor.deviceId, nowMs) ?? 0;
  const end = Math.min(toMs, lastSeen);
  const start = Math.max(fromMs, end - MAX_RANGE_MS);
  const readings: Reading[] = [];

  for (let ts = Math.ceil(start / STEP_MS) * STEP_MS; ts <= end; ts += STEP_MS) {
    if (isInGap(sensor.deviceId, ts)) continue;
    readings.push(buildReading(sensor, ts, sim));
  }

  return readings;
}

export function buildHistory(
  sensor: Sensor,
  fromMs: number,
  toMs: number,
  interval: HistoryInterval,
  nowMs: number = Date.now(),
): HistoryResponse {
  const readings = generateSeries(sensor, fromMs, toMs, nowMs);
  const bucketMs = INTERVAL_MS[interval];
  const buckets = new Map<number, Reading[]>();

  for (const reading of readings) {
    const key = Math.floor(Date.parse(reading.recordedAt) / bucketMs) * bucketMs;
    const group = buckets.get(key);
    if (group) group.push(reading);
    else buckets.set(key, [reading]);
  }

  const items: HistoryPoint[] = Array.from(buckets.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([key, group]) => {
      const values = group.map((r) => r.value).filter((v): v is number => v !== null);
      const quality = group.find((r) => r.quality !== 'VALID')?.quality ?? 'VALID';
      const timestamp = new Date(key).toISOString();

      if (values.length === 0) {
        return { timestamp, value: null, min: null, max: null, sampleCount: 0, quality };
      }

      const sum = values.reduce((total, v) => total + v, 0);
      return {
        timestamp,
        value: round1(sum / values.length),
        min: Math.min(...values),
        max: Math.max(...values),
        sampleCount: values.length,
        quality,
      };
    });

  const allValues = readings.map((r) => r.value).filter((v): v is number => v !== null);
  const summary =
    allValues.length === 0
      ? null
      : {
          min: Math.min(...allValues),
          max: Math.max(...allValues),
          avg: round1(allValues.reduce((total, v) => total + v, 0) / allValues.length),
        };

  return {
    deviceId: sensor.deviceId,
    sensorId: sensor.id,
    type: sensor.type,
    unit: sensor.unit,
    interval,
    items,
    summary,
    simulatedData: true,
  };
}