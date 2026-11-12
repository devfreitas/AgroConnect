import type { Page } from '@/types/api';
import type { Recommendation } from '@/types/domain';

import { aiApi } from './api';

/** Pede à API de IA as recomendações para um dispositivo. Pode demorar (timeout de 60 s). */
export async function requestRecommendations(
  deviceId: string,
  signal?: AbortSignal,
): Promise<Recommendation[]> {
  const { data } = await aiApi.post<Page<Recommendation>>(
    '/recommendations',
    { deviceId },
    { signal },
  );
  return data.items;
}
