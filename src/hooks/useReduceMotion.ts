import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Retorna se o usuário ativou a opção de acessibilidade para reduzir ou remover animações no sistema operacional.
 */
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  return reduceMotion;
}
