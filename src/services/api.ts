import { config } from './config';
import { createHttpClient } from './httpClient';

/** API principal (C#): autenticação, CRUD, leituras, histórico e alertas. */
export const api = createHttpClient(config.apiUrl);

/** API de IA: recomendações. */
export const aiApi = createHttpClient(config.aiApiUrl);
