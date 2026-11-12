import type { Page } from '@/types/api';
import type { Alert, AlertStatus } from '@/types/domain';

import { api } from './api';

/** Lista os alertas (primeira página, até 100 itens), ordenados pela API por severidade e data. */
export async function listAlerts(status?: AlertStatus, signal?: AbortSignal): Promise<Alert[]> {
  const { data } = await api.get<Page<Alert>>('/alerts', {
    params: { page: 1, size: 100, ...(status ? { status } : {}) },
    signal,
  });
  return data.items;
}

export async function markAlertAsRead(id: string): Promise<Alert> {
  const { data } = await api.patch<Alert>(`/alerts/${id}/read`);
  return data;
}
