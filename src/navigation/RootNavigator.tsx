import { StatusBar } from 'expo-status-bar';

import { Loader } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { PushNotificationsHandler } from './PushNotificationsHandler';

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <>
        <StatusBar style="dark" />
        <Loader fullScreen message="Verificando sua sessão..." />
      </>
    );
  }

  if (status === 'authenticated') {
    return (
      <>
        <StatusBar style="light" />
        <AppNavigator />
        <PushNotificationsHandler />
      </>
    );
  }

  // Telas de acesso têm fundo claro: ícones escuros na barra de status.
  return (
    <>
      <StatusBar style="dark" />
      <AuthNavigator />
    </>
  );
}
