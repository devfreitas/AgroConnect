import type { HistoryInterval, HistoryResponse } from '@/types/domain';

import { api } from './api';

export type HistoryQuery = {
  sensorId: string;
  /** Datas ISO em UTC. */
  from: string;
  to: string;
  interval: HistoryInterval;
};

/** Histórico agregado de um sensor. Períodos sem dados não geram item. */
export async function getHistory(
  deviceId: string,
  query: HistoryQuery,
  signal?: AbortSignal,
): Promise<HistoryResponse> {
  const { data } = await api.get<HistoryResponse>(`/devices/${deviceId}/readings`, {
    params: query,
    signal,
  });
  return data;
}
