import {  createContext,  useCallback,  useEffect,  useMemo,  useRef,  useState,  type ReactNode } from 'react';
import {  fetchCurrentUser,  loginRequest,  logoutRequest,  normalizeError,  registerRequest,  setAuthTokenGetter,  setUnauthorizedHandler,  type LoginPayload,  type RegisterPayload } from '@/services';
import { clearSession, loadSession, saveSession } from '@/services/tokenStorage';
import type { User } from '@/types/domain';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  /** Aviso exibido na tela de login (ex.: sessão expirada). */
  sessionMessage: string | null;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  clearSessionMessage: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_EXPIRED_MESSAGE = 'Sua sessão expirou. Entre novamente.';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const tokenRef = useRef<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);
  const [sessionMessage, setSessionMessage] = useState<string | null>(null);

  const endSession = useCallback(async (message?: string) => {
    tokenRef.current = null;
    setUser(null);
    setSessionMessage(message ?? null);
    setStatus('unauthenticated');
    await clearSession();
  }, []);

  const startSession = useCallback(async (token: string, nextUser: User) => {
    tokenRef.current = token;
    setUser(nextUser);
    setSessionMessage(null);
    setStatus('authenticated');
    await saveSession(token, nextUser);
  }, []);

  // Liga a camada de serviços ao contexto: de onde vem o token e o que fazer num 401.
  useEffect(() => {
    setAuthTokenGetter(() => tokenRef.current);
    setUnauthorizedHandler(() => {
      // Só reage se houver sessão ativa: vários 401 simultâneos encerram a sessão uma única vez.
      if (tokenRef.current) {
        void endSession(SESSION_EXPIRED_MESSAGE);
      }
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, [endSession]);

  // Restaura a sessão salva ao abrir o app.
  useEffect(() => {
    let active = true;

    async function restore() {
      const saved = await loadSession();
      if (!active) return;

      if (!saved) {
        setStatus('unauthenticated');
        return;
      }

      tokenRef.current = saved.token;

      try {
        const freshUser = await fetchCurrentUser();
        if (!active) return;

        setUser(freshUser);
        setStatus('authenticated');
        await saveSession(saved.token, freshUser);
      } catch (error) {
        if (!active) return;

        if (normalizeError(error).kind === 'unauthorized') {
          await endSession(SESSION_EXPIRED_MESSAGE);
          return;
        }

        // API inalcançável (sem internet, servidor hibernando): mantém a sessão salva
        // para permitir a consulta offline. Um 401 futuro encerra a sessão.
        setUser(saved.user);
        setStatus('authenticated');
      }
    }

    void restore();

    return () => {
      active = false;
    };
  }, [endSession]);

  const signIn = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginRequest(payload);
      await startSession(response.accessToken, response.user);
    },
    [startSession],
  );

  const signUp = useCallback(
    async (payload: RegisterPayload) => {
      const response = await registerRequest(payload);
      await startSession(response.accessToken, response.user);
    },
    [startSession],
  );

  const signOut = useCallback(async () => {
    const token = tokenRef.current;
    await endSession();

    if (token) {
      try {
        await logoutRequest(token);
      } catch {
        // A sessão local já foi encerrada; a falha ao avisar o servidor não afeta o usuário.
      }
    }
  }, [endSession]);

  const clearSessionMessage = useCallback(() => setSessionMessage(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, sessionMessage, signIn, signUp, signOut, clearSessionMessage }),
    [status, user, sessionMessage, signIn, signUp, signOut, clearSessionMessage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}