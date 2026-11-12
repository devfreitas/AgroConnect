import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import {
  configureNotifications,
  ensureNotificationChannel,
  getPushPermission,
  registerPushToken,
  requestPushPermission,
} from '@/services';

import { navigateToAlerts } from './navigationRef';

/** Toque já tratado, para não reabrir os alertas ao entrar de novo com a mesma notificação. */
let handledResponseKey: string | null = null;

function openAlertsFor(response: Notifications.NotificationResponse | null) {
  if (!response) return;

  const key = `${response.notification.request.identifier}:${response.actionIdentifier}`;
  if (key === handledResponseKey) return;

  handledResponseKey = key;
  navigateToAlerts();
}

/**
 * Ligado só com o usuário logado. Pede permissão, registra o token no servidor
 * e abre os alertas quando o usuário toca em uma notificação.
 * Falhas aqui nunca interrompem o uso do app.
 */
export function PushNotificationsHandler() {
  useEffect(() => {
    configureNotifications();

    async function setup() {
      try {
        await ensureNotificationChannel();

        let permission = await getPushPermission();
        if (permission.status === 'undetermined') {
          permission = await requestPushPermission();
        }

        if (permission.status === 'granted') {
          await registerPushToken();
        }
      } catch {
        // Sem rede, sem Google Play Services ou endpoint ainda indisponível: tenta de novo no próximo acesso.
      }
    }

    void setup();

    // Toque com o app aberto ou em segundo plano.
    const subscription = Notifications.addNotificationResponseReceivedListener(openAlertsFor);

    // Toque que abriu o app do zero.
    void Notifications.getLastNotificationResponseAsync().then(openAlertsFor);

    return () => subscription.remove();
  }, []);

  return null;
}
