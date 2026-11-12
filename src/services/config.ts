// Em desenvolvimento, usa as APIs locais se o .env não existir. Em um build de entrega,
// as URLs precisam vir das variáveis EXPO_PUBLIC_* (https). Sem elas, o app avisa na tela de login
// em vez de apontar em silêncio para um endereço local, que o Android bloqueia.
const DEV_API_URL = 'http://localhost:5000/api/v1';
const DEV_AI_API_URL = 'http://localhost:8000/api/v1';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? (__DEV__ ? DEV_API_URL : '');
const aiApiUrl = process.env.EXPO_PUBLIC_AI_API_URL ?? (__DEV__ ? DEV_AI_API_URL : '');

export const config = {
  /** API principal (C#): autenticação, CRUD, leituras, histórico e alertas. */
  apiUrl,
  /** API de IA: recomendações. */
  aiApiUrl,
  /** Falso quando o build não recebeu as URLs das APIs. */
  isConfigured: apiUrl !== '' && aiApiUrl !== '',
  /** Tempo máximo de espera. Alto de propósito: o Render gratuito hiberna e a primeira chamada demora. */
  requestTimeoutMs: 60_000,
} as const;
