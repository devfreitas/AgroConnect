import type { DeviceStatus, ReadingQuality, ReadingType } from '@/types/domain';

type IconName = 'water' | 'thermometer' | 'cloud' | 'sunny';

export const READING_INFO: Record<ReadingType, { label: string; icon: IconName }> = {
  SOIL_MOISTURE: { label: 'Umidade do solo', icon: 'water' },
  AIR_TEMPERATURE: { label: 'Temperatura do ar', icon: 'thermometer' },
  AIR_HUMIDITY: { label: 'Umidade do ar', icon: 'cloud' },
  LIGHT_ILLUMINANCE: { label: 'Luminosidade', icon: 'sunny' },
};

/** Ordem fixa dos cartões na tela. */
export const READING_ORDER: ReadingType[] = [
  'SOIL_MOISTURE',
  'AIR_TEMPERATURE',
  'AIR_HUMIDITY',
  'LIGHT_ILLUMINANCE',
];

export const QUALITY_LABELS: Record<ReadingQuality, string> = {
  VALID: 'Leitura válida',
  OUT_OF_RANGE: 'Fora da faixa esperada',
  SENSOR_ERROR: 'Erro no sensor',
  UNCALIBRATED: 'Sensor sem calibração',
};

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  ONLINE: 'Online',
  UNSTABLE: 'Instável',
  OFFLINE: 'Offline',
  UNKNOWN: 'Sem informação',
};

/** Valor com unidade (ex.: "27,5 °C"). Sem valor, mostra "Sem leitura". */
export function formatReadingValue(value: number | null, unit: string): string {
  if (value === null) return 'Sem leitura';
  const text = value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return unit === '%' ? `${text}%` : `${text} ${unit}`;
}
