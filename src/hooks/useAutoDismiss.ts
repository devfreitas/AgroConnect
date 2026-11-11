import { useEffect } from 'react';

/** Chama `dismiss` depois de `ms` milissegundos sempre que `value` tem um valor (ex.: aviso de sucesso). */
export function useAutoDismiss(value: string | undefined, dismiss: () => void, ms = 4000): void {
  useEffect(() => {
    if (!value) return;

    const timer = setTimeout(dismiss, ms);
    return () => clearTimeout(timer);
  }, [value, dismiss, ms]);
}
