import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { HttpError, handleRequest } from './handlers';

const DEFAULT_DELAY_MS = 400;
const AI_DELAY_MS = 1200;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseUrl(rawUrl: string | undefined, params: unknown) {
  const [rawPath = '', search = ''] = (rawUrl ?? '').split('?');
  const withSlash = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const path = withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
  const query: Record<string, string> = {};

  for (const pair of search.split('&')) {
    if (!pair) continue;
    const [key = '', value = ''] = pair.split('=');
    query[decodeURIComponent(key)] = decodeURIComponent(value);
  }

  if (typeof params === 'object' && params !== null) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) query[key] = String(value);
    }
  }

  return { path, query };
}

function parseBody(data: unknown): Record<string, unknown> {
  if (typeof data === 'string' && data.length > 0) {
    try {
      const parsed: unknown = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return {};
    }
  } else if (typeof data === 'object' && data !== null) {
    return data as Record<string, unknown>;
  }
  return {};
}

/** Adapter do Axios que responde com dados simulados, sem rede. */
export async function mockAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  const { path, query } = parseUrl(config.url, config.params);
  await wait(path === '/recommendations' ? AI_DELAY_MS : DEFAULT_DELAY_MS);

  const rawAuthorization = config.headers.get('Authorization');
  const authorization = typeof rawAuthorization === 'string' ? rawAuthorization : '';

  try {
    const result = handleRequest({
      method: (config.method ?? 'get').toUpperCase(),
      path,
      query,
      body: parseBody(config.data),
      authorization,
    });

    return { data: result.data, status: result.status, statusText: 'OK', headers: {}, config };
  } catch (error) {
    if (error instanceof HttpError) {
      const response: AxiosResponse = {
        data: error.body,
        status: error.status,
        statusText: 'Error',
        headers: {},
        config,
      };
      const code = error.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST;
      throw new AxiosError(error.message, code, config, null, response);
    }
    throw error;
  }
}