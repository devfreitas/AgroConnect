import { createNavigationContainerRef } from '@react-navigation/native';

import type { AppTabParamList } from '@/types/navigation';

/** Permite navegar fora de componentes de tela (ex.: ao tocar em uma notificação). */
export const navigationRef = createNavigationContainerRef<AppTabParamList>();

/** Abre a lista de alertas. Se o app ainda está abrindo, tenta de novo por até 5 segundos. */
export function navigateToAlerts(attemptsLeft = 50): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate('AnalyticsTab', { screen: 'Alerts' });
    return;
  }

  if (attemptsLeft > 0) {
    setTimeout(() => navigateToAlerts(attemptsLeft - 1), 100);
  }
}
