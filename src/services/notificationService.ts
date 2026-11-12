import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { api } from './api';

export const ALERTS_CHANNEL_ID = 'alerts';

export type PushPermissionStatus = 'granted' | 'denied' | 'undetermined';

export type PushPermission = {
  status: PushPermissionStatus;
  /** Se o sistema ainda aceita mostrar o pedido de permissão. */
  canAskAgain: boolean;
};

/** Notificações recebidas com o app aberto aparecem como aviso, sem som. */
export function configureNotifications(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** No Android 13 ou superior, o canal precisa existir antes de pedir a permissão. */
export async function ensureNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(ALERTS_CHANNEL_ID, {
    name: 'Alertas',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function getPushPermission(): Promise<PushPermission> {
  const { status, canAskAgain } = await Notifications.getPermissionsAsync();
  return { status, canAskAgain };
}

export async function requestPushPermission(): Promise<PushPermission> {
  await ensureNotificationChannel();
  const { status, canAskAgain } = await Notifications.requestPermissionsAsync();
  return { status, canAskAgain };
}

/**
 * Obtém o token de push do aparelho e o envia à API.
 * Retorna false quando não é possível (emulador, sem permissão ou sem projeto EAS configurado).
 * Erros de rede são lançados para quem chamou decidir; o app nunca depende disso para funcionar.
 */
export async function registerPushToken(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return false;

  const { status } = await getPushPermission();
  if (status !== 'granted') return false;

  await ensureNotificationChannel();
  const { data: token } = await Notifications.getExpoPushTokenAsync({ projectId });

  await api.post('/me/push-tokens', { token, platform: 'android' });
  return true;
}
