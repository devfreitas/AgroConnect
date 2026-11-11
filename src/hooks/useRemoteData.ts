import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef, useState, type DependencyList } from 'react';

import { normalizeError, type ApiError } from '@/services';

export type RemoteData<T> = {
  data: T | null;
  /** Erro da última tentativa. Pode coexistir com `data` (dados antigos mantidos). */
  error: ApiError | null;
  /** Carregamento inicial (ainda sem dados). */
  loading: boolean;
  /** Atualização manual (puxar para atualizar). */
  refreshing: boolean;
  /** Quando os dados atuais foram recebidos com sucesso. */
  updatedAt: Date | null;
  /** Tenta de novo exibindo o carregamento (botão "Tentar novamente"). */
  reload: () => void;
  /** Atualiza mantendo os dados na tela (puxar para atualizar). */
  refresh: () => void;
};

type LoadMode = 'focus' | 'refresh';

/**
 * Busca dados remotos sempre que a tela ganha foco.
 * Na primeira vez mostra o carregamento; nas seguintes atualiza sem tirar os dados da tela.
 * Cancela a requisição ao sair da tela e ignora respostas atrasadas.
 */
export function useRemoteData<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: DependencyList = [],
): RemoteData<T> {
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const controllerRef = useRef<AbortController | null>(null);
  const hasDataRef = useRef(false);

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(async (mode: LoadMode) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setRefreshing(mode === 'refresh');
    if (!hasDataRef.current) setLoading(true);

    try {
      const result = await fetcherRef.current(controller.signal);
      if (controller.signal.aborted) return;

      hasDataRef.current = true;
      setData(result);
      setError(null);
      setUpdatedAt(new Date());
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
  }, []);

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

  return { data, error, loading, refreshing, updatedAt, reload, refresh };
}
