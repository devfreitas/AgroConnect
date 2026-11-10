/** Corpo de erro padronizado da API (conforme o briefing). */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
  timestamp?: string;
};

/** Resposta paginada. Formato de `page` é proposta, validar com o backend. */
export type Page<T> = {
  items: T[];
  page: {
    number: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
};
