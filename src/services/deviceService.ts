import type { Page } from '@/types/api';
import type { Device, LatestReadings } from '@/types/domain';

import { api } from './api';

/** Lista os dispositivos do usuário (primeira página, até 100 itens). */
export async function listDevices(signal?: AbortSignal): Promise<Device[]> {
  const { data } = await api.get<Page<Device>>('/devices', {
    params: { page: 1, size: 100 },
    signal,
  });
  return data.items;
}

/** Última leitura de cada sensor do dispositivo. */
export async function getLatestReadings(
  deviceId: string,
  signal?: AbortSignal,
): Promise<LatestReadings> {
  const { data } = await api.get<LatestReadings>(`/devices/${deviceId}/readings/latest`, {
    signal,
  });
  return data;
}
