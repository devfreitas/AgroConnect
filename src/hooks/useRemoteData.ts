import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState, type DependencyList } from 'react';

import { normalizeError, readCache, writeCache, type ApiError } from '@/services';

export type RemoteData<T> = {
  data: T | null;
  /** Erro da última tentativa. Pode coexistir com `data` (dados antigos mantidos). */
  error: ApiError | null;
  /** Carregamento inicial (ainda sem dados). */
  loading: boolean;
  /** Atualização manual (puxar para atualizar). */
  refreshing: boolean;
  /** Quando os dados atuais foram recebidos com sucesso (ou salvos, se vieram do cache). */
  updatedAt: Date | null;
  /** Os dados exibidos vieram do cache salvo no aparelho, não do servidor. */
  fromCache: boolean;
  /** Tenta de novo exibindo o carregamento (botão "Tentar novamente"). */
  reload: () => void;
  /** Atualiza mantendo os dados na tela (puxar para atualizar). */
  refresh: () => void;
};

type Options = {
  /** Chave de cache. Sem ela, os dados não são salvos nem lidos do aparelho. */
  cacheKey?: string;
};

type LoadMode = 'focus' | 'refresh';

/**
 * Busca dados remotos sempre que a tela ganha foco.
 * Na primeira vez mostra o carregamento; nas seguintes atualiza sem tirar os dados da tela.
 * Com `cacheKey`, mostra de imediato o último dado salvo e o mantém se a rede falhar.
 * Cancela a requisição ao sair da tela e ignora respostas atrasadas.
 */
export function useRemoteData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = [],
  options: Options = {},
): RemoteData<T> {
  const { cacheKey } = options;

  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const controllerRef = useRef<AbortController | null>(null);
  const hasDataRef = useRef(false);
  /** Chave de cache dos dados que estão na tela. */
  const dataKeyRef = useRef<string | undefined>(cacheKey);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(
    async (mode: LoadMode) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      // Outra seleção (ex.: outro sensor): os dados na tela não valem mais.
      if (cacheKey !== dataKeyRef.current) {
        dataKeyRef.current = cacheKey;
        hasDataRef.current = false;
        setData(null);
        setUpdatedAt(null);
        setFromCache(false);
      }

      setRefreshing(mode === 'refresh');

      if (!hasDataRef.current) {
        setLoading(true);

        if (cacheKey) {
          const cached = await readCache<T>(cacheKey);
          if (controller.signal.aborted) return;

          if (cached) {
            hasDataRef.current = true;
            setData(cached.data);
            setUpdatedAt(cached.savedAt);
            setFromCache(true);
            setLoading(false);
          }
        }
      }

      try {
        const result = await fetcherRef.current(controller.signal);
        if (controller.signal.aborted) return;

        hasDataRef.current = true;
        setData(result);
        setError(null);
        setUpdatedAt(new Date());
        setFromCache(false);
        if (cacheKey) void writeCache(cacheKey, result);
      } catch (caught) {
        const apiError = normalizeError(caught);
        if (controller.signal.aborted || apiError.kind === 'canceled') return;

        setError(apiError);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [cacheKey],
  );

  useFocusEffect(
    useCallback(() => {
      void load('focus');
      return () => controllerRef.current?.abort();
    }, [load, ...deps]),
  );

  const reload = useCallback(() => {
    void load('focus');
  }, [load]);

  const refresh = useCallback(() => {
    void load('refresh');
  }, [load]);

  return { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh };
}
