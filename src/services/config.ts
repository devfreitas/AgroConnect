const DEFAULT_API_URL = 'http://localhost:5000/api/v1';
const DEFAULT_AI_API_URL = 'http://localhost:8000/api/v1';

export const config = {
  /** API principal (C#): autenticação, CRUD, leituras, histórico e alertas. */
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_API_URL,
  /** API de IA: recomendações. */
  aiApiUrl: process.env.EXPO_PUBLIC_AI_API_URL ?? DEFAULT_AI_API_URL,
  /** Tempo máximo de espera. Alto de propósito: o Render gratuito hiberna e a primeira chamada demora. */
  requestTimeoutMs: 60_000,
} as const;
