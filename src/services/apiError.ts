import axios from 'axios';

import type { ApiErrorBody } from '@/types/api';

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'canceled'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'server'
  | 'unknown';

type ApiErrorParams = {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  timestamp?: string;
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly timestamp?: string;

  constructor(params: ApiErrorParams) {
    super(params.message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
    this.kind = params.kind;
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.timestamp = params.timestamp;
  }
}

const defaultMessages: Record<ApiErrorKind, string> = {
  network: 'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
  timeout: 'O servidor demorou para responder. Tente novamente em instantes.',
  canceled: 'A requisição foi cancelada.',
  unauthorized: 'Sua sessão expirou. Entre novamente.',
  forbidden: 'Você não tem permissão para realizar esta ação.',
  not_found: 'O item solicitado não foi encontrado.',
  validation: 'Os dados enviados são inválidos. Revise e tente novamente.',
  conflict: 'Esta ação conflita com o estado atual dos dados.',
  server: 'O servidor encontrou um problema. Tente novamente em instantes.',
  unknown: 'Algo deu errado. Tente novamente.',
};

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 400 || status === 422) return 'validation';
  if (status === 409) return 'conflict';
  if (status >= 500) return 'server';
  return 'unknown';
}

function parseBody(data: unknown): ApiErrorBody | undefined {
  if (typeof data !== 'object' || data === null) return undefined;
  const body = data as Record<string, unknown>;
  return {
    code: typeof body.code === 'string' ? body.code : undefined,
    message: typeof body.message === 'string' ? body.message : undefined,
    details: body.details,
    timestamp: typeof body.timestamp === 'string' ? body.timestamp : undefined,
  };
}

/** Converte qualquer erro (Axios ou não) em um ApiError com mensagem em português. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isCancel(error)) {
    return new ApiError({ kind: 'canceled', message: defaultMessages.canceled });
  }

  if (axios.isAxiosError(error)) {
    if (error.response) {
      const { status, data } = error.response;
      const body = parseBody(data);
      const kind = kindFromStatus(status);
      // A mensagem do servidor só é exibida em erros 4xx; em 5xx usamos a genérica.
      const message =
        status < 500 && body?.message ? body.message : defaultMessages[kind];

      return new ApiError({
        kind,
        message,
        status,
        code: body?.code,
        details: body?.details,
        timestamp: body?.timestamp,
      });
    }

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({ kind: 'timeout', message: defaultMessages.timeout });
    }

    return new ApiError({ kind: 'network', message: defaultMessages.network });
  }

  return new ApiError({ kind: 'unknown', message: defaultMessages.unknown });
}

/** Atalho para exibir erros nas telas. */
export function getErrorMessage(error: unknown): string {
  return normalizeError(error).message;
}