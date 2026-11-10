import * as SecureStore from 'expo-secure-store';

import type { User } from '@/types/domain';

const TOKEN_KEY = 'agroconnect.accessToken';
const USER_KEY = 'agroconnect.user';

export type StoredSession = {
  token: string;
  user: User;
};

/** Lê a sessão salva no armazenamento seguro. Retorna null se não houver ou estiver corrompida. */
export async function loadSession(): Promise<StoredSession | null> {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const rawUser = await SecureStore.getItemAsync(USER_KEY);
    if (!token || !rawUser) return null;

    const user = JSON.parse(rawUser) as User;
    return { token, user };
  } catch {
    await clearSession();
    return null;
  }
}

/** Salva a sessão. Se o armazenamento falhar, a sessão continua válida apenas em memória. */
export async function saveSession(token: string, user: User): Promise<void> {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  } catch {
    // Sem persistência: o usuário precisará entrar de novo na próxima abertura.
  }
}

/** Remove token e usuário salvos (logout ou sessão expirada). */
export async function clearSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  } catch {
    // Nada a fazer: se não conseguiu apagar, não havia o que apagar.
  }
}
