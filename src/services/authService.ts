import type { AuthResponse, User } from '@/types/domain';

import { api } from './api';

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

/** Login e cadastro usam skipAuth: um 401 aqui significa "credenciais inválidas", não "sessão expirada". */
export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', payload, { skipAuth: true });
  return data;
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', payload, { skipAuth: true });
  return data;
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}

/**
 * Avisa o servidor que a sessão terminou. Recebe o token explicitamente porque a sessão local
 * já foi encerrada quando esta chamada acontece.
 */
export async function logoutRequest(token: string): Promise<void> {
  await api.post('/auth/logout', undefined, {
    skipAuth: true,
    headers: { Authorization: `Bearer ${token}` },
  });
}
