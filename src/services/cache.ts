import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = 'agroconnect:cache:';

type CacheEntry<T> = { savedAt: number; data: T };

/** Lê um dado salvo. Falhas de leitura são ignoradas: o cache é só um apoio para uso offline. */
export async function readCache<T>(key: string): Promise<{ data: T; savedAt: Date } | null> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const entry = JSON.parse(raw) as CacheEntry<T>;
    return { data: entry.data, savedAt: new Date(entry.savedAt) };
  } catch {
    return null;
  }
}

export async function writeCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = { savedAt: Date.now(), data };
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(entry));
  } catch {
    // Sem espaço ou armazenamento indisponível: o app segue funcionando sem cache.
  }
}

/** Apaga todo o cache. Chamado ao encerrar a sessão para não expor dados a outro usuário. */
export async function clearCache(): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const own = keys.filter((key) => key.startsWith(PREFIX));
    if (own.length > 0) await AsyncStorage.multiRemove(own);
  } catch {
    // Ignora: nada a fazer se o armazenamento estiver indisponível.
  }
}
