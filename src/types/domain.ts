export type ReadingType =
  | 'SOIL_MOISTURE'
  | 'AIR_TEMPERATURE'
  | 'AIR_HUMIDITY'
  | 'LIGHT_ILLUMINANCE';

export type ReadingQuality = 'VALID' | 'OUT_OF_RANGE' | 'SENSOR_ERROR' | 'UNCALIBRATED';
export type DeviceStatus = 'ONLINE' | 'UNSTABLE' | 'OFFLINE' | 'UNKNOWN';
export type AlertSeverity = 'INFO' | 'WARNING' | 'CRITICAL';
export type AlertStatus = 'UNREAD' | 'READ' | 'RESOLVED';
export type PlantingStage = 'SEEDLING' | 'VEGETATIVE' | 'MATURATION' | 'HARVEST';
export type HistoryInterval = 'raw' | '5m' | '15m' | '1h' | '1d';

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
};

export type Property = {
  id: string;
  name: string;
  city: string;
  state: string;
  areaHectares: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PropertyInput = {
  name: string;
  city: string;
  state: string;
  areaHectares: number;
  description?: string | null;
};

export type Field = {
  id: string;
  propertyId: string;
  name: string;
  areaHectares: number;
};

export type Planting = {
  id: string;
  fieldId: string;
  cropName: string;
  plantedAt: string;
  stage: PlantingStage;
};

export type Device = {
  id: string;
  code: string;
  name: string;
  fieldId: string;
  status: DeviceStatus;
  lastSeenAt: string | null;
  rssi: number | null;
  firmwareVersion: string;
};

export type Sensor = {
  id: string;
  deviceId: string;
  type: ReadingType;
  label: string;
  unit: string;
};

export type Reading = {
  sensorId: string;
  type: ReadingType;
  value: number | null;
  unit: string;
  quality: ReadingQuality;
  recordedAt: string;
};

/** Recorte de uma leitura usado para explicar alertas e recomendações. */
export type ReadingSnapshot = Pick<Reading, 'type' | 'value' | 'unit' | 'recordedAt'>;

export type LatestReadings = {
  deviceId: string;
  recordedAt: string | null;
  readings: Reading[];
  simulatedData: boolean;
};

export type HistoryPoint = {
  timestamp: string;
  value: number | null;
  min: number | null;
  max: number | null;
  sampleCount: number;
  quality: ReadingQuality;
};

export type HistoryResponse = {
  deviceId: string;
  sensorId: string;
  type: ReadingType;
  unit: string;
  interval: HistoryInterval;
  items: HistoryPoint[];
  summary: { min: number; max: number; avg: number } | null;
  simulatedData: boolean;
};

export type Alert = {
  id: string;
  deviceId: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  reason: string;
  basedOn: ReadingSnapshot[];
  createdAt: string;
};

export type Recommendation = {
  id: string;
  generatedAt: string;
  priority: AlertSeverity;
  title: string;
  message: string;
  reason: string;
  basedOn: ReadingSnapshot[];
  disclaimer: string;
  simulatedData: boolean;
};