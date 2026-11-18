import { useEffect, useState } from 'react';

/** Conta os segundos desde que `active` ficou verdadeiro. Volta a zero quando ele desliga. */
export function useElapsedSeconds(active: boolean): number {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [active]);

  return seconds;
}
