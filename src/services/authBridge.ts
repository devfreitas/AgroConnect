type TokenGetter = () => string | null;
type UnauthorizedHandler = () => void;

let tokenGetter: TokenGetter = () => null;
let unauthorizedHandler: UnauthorizedHandler | null = null;

/** Registra como obter o token atual (chamado pelo AuthContext). */
export function setAuthTokenGetter(getter: TokenGetter): void {
  tokenGetter = getter;
}

/** Registra o que fazer quando a API responde 401 (sessão expirada). */
export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
}

export function getAuthToken(): string | null {
  return tokenGetter();
}

export function notifyUnauthorized(): void {
  unauthorizedHandler?.();
}
