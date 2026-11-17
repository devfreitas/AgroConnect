import type { Page } from '@/types/api';
import type { Recommendation } from '@/types/domain';

import { aiApi } from './api';

/** Pede as recomendações (IA generativa, por trás da API principal). Pode demorar (timeout de 60 s). */
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
