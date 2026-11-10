import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { normalizeError } from '@/services';

/**
 * Distribui o erro da API pelos campos do formulário.
 * Retorna a mensagem a exibir no formulário, ou null se o erro foi atribuído a um campo.
 */
export function applyServerErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): string | null {
  const apiError = normalizeError(error);
  let mapped = false;

  const { details } = apiError;
  if (typeof details === 'object' && details !== null && !Array.isArray(details)) {
    const record = details as Record<string, unknown>;

    for (const field of fields) {
      const message = record[field];
      if (typeof message === 'string') {
        setError(field, { type: 'server', message });
        mapped = true;
      }
    }
  }

  // E-mail já cadastrado (409): mostra no próprio campo de e-mail.
  const emailField = 'email' as Path<T>;
  if (!mapped && apiError.kind === 'conflict' && fields.includes(emailField)) {
    setError(emailField, { type: 'server', message: apiError.message });
    mapped = true;
  }

  return mapped ? null : apiError.message;
}
