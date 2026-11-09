import { config } from './config';
import { createHttpClient } from './httpClient';
import { mockAdapter } from './mock/adapter';

/** API principal (C#): autenticação, CRUD, leituras, histórico e alertas. */
export const api = createHttpClient(config.apiUrl);

/** API de IA: recomendações. */
export const aiApi = createHttpClient(config.aiApiUrl);

// Com EXPO_PUBLIC_USE_MOCK=true, as respostas vêm de dados simulados locais, sem rede.
if (config.useMock) {
  api.defaults.adapter = mockAdapter;
  aiApi.defaults.adapter = mockAdapter;
}