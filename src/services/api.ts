import { config } from './config';
import { createHttpClient } from './httpClient';

/** API principal (Java): autenticação, CRUD, leituras, histórico e alertas. */
export const api = createHttpClient(config.apiUrl);

/** Recomendações (hoje na mesma API; pode apontar para outro serviço). */
export const aiApi = createHttpClient(config.aiApiUrl);
