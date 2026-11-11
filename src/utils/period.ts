import type { HistoryInterval } from '@/types/domain';

export type PeriodKey = '24h' | '7d' | '30d';

export const PERIODS: { key: PeriodKey; label: string; hours: number; interval: HistoryInterval }[] = [
  { key: '24h', label: '24 horas', hours: 24, interval: '1h' },
  { key: '7d', label: '7 dias', hours: 24 * 7, interval: '1h' },
  { key: '30d', label: '30 dias', hours: 24 * 30, interval: '1d' },
];

/** Período em datas ISO (UTC) terminando agora, com o intervalo de agregação adequado. */
export function buildRange(key: PeriodKey): { from: string; to: string; interval: HistoryInterval } {
  const period = PERIODS.find((item) => item.key === key) ?? PERIODS[0];
  const to = new Date();
  const from = new Date(to.getTime() - period.hours * 60 * 60 * 1000);
  return { from: from.toISOString(), to: to.toISOString(), interval: period.interval };
}
