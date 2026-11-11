import type { Page } from '@/types/api';
import type { Property, PropertyInput } from '@/types/domain';

import { api } from './api';

/** Lista as propriedades do usuário (primeira página, até 100 itens). */
export async function listProperties(signal?: AbortSignal): Promise<Property[]> {
  const { data } = await api.get<Page<Property>>('/properties', {
    params: { page: 1, size: 100 },
    signal,
  });
  return data.items;
}

export async function getProperty(id: string, signal?: AbortSignal): Promise<Property> {
  const { data } = await api.get<Property>(`/properties/${id}`, { signal });
  return data;
}

export async function createProperty(input: PropertyInput): Promise<Property> {
  const { data } = await api.post<Property>('/properties', input);
  return data;
}

export async function updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property> {
  const { data } = await api.patch<Property>(`/properties/${id}`, input);
  return data;
}
