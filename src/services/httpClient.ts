import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

import { normalizeError } from './apiError';
import { getAuthToken, notifyUnauthorized } from './authBridge';
import { config } from './config';

declare module 'axios' {
  export interface AxiosRequestConfig {
    /** Não envia o token nem trata 401 como sessão expirada (ex.: login e cadastro). */
    skipAuth?: boolean;
  }
}

export function createHttpClient(baseURL: string): AxiosInstance {
  const client = axios.create({
    baseURL,
    timeout: config.requestTimeoutMs,
    headers: { Accept: 'application/json' },
  });

  client.interceptors.request.use((request: InternalAxiosRequestConfig) => {
    if (request.skipAuth) return request;

    const token = getAuthToken();
    if (token) {
      request.headers.set('Authorization', `Bearer ${token}`);
    }
    return request;
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const apiError = normalizeError(error);
      const skipAuth = axios.isAxiosError(error) && error.config?.skipAuth;

      if (apiError.kind === 'unauthorized' && !skipAuth) {
        notifyUnauthorized();
      }

      return Promise.reject(apiError);
    },
  );

  return client;
}
