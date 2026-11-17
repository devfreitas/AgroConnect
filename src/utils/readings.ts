import { colors } from '@/theme';
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

/** Cor e fundo suave de cada tipo de leitura (decorativo; o texto sempre diz o que é). */
export const READING_TONE: Record<ReadingType, { color: string; soft: string }> = {
  SOIL_MOISTURE: { color: colors.info, soft: colors.infoSoft },
  AIR_TEMPERATURE: { color: colors.primaryDark, soft: colors.primarySoft },
  AIR_HUMIDITY: { color: '#3F7773', soft: '#DAEAE8' },
  LIGHT_ILLUMINANCE: { color: colors.warning, soft: colors.warningSoft },
};

/** Tipos cuja escala natural é 0 a 100% (permitem barra de progresso sem inventar limites). */
export const PERCENT_TYPES: ReadingType[] = ['SOIL_MOISTURE', 'AIR_HUMIDITY'];

/** Barras de sinal (0 a 4) a partir do RSSI em dBm. */
export function signalBars(rssi: number | null): number {
  if (rssi === null) return 0;
  if (rssi >= -60) return 4;
  if (rssi >= -70) return 3;
  if (rssi >= -80) return 2;
  return 1;
}
