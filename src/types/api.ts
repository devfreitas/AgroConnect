/** Corpo de erro da API. */
export type ApiErrorBody = {
  code?: string;
  message?: string;
  details?: unknown;
  timestamp?: string;
};

/** Resposta paginada. */
export type Page<T> = {
  items: T[];
  page: {
    number: number;
    size: number;
    totalItems: number;
    totalPages: number;
  };
};