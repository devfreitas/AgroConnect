import { Loader } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';
import { PushNotificationsHandler } from './PushNotificationsHandler';

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <Loader fullScreen message="Verificando sua sessão..." />;
  }

  if (status === 'authenticated') {
    return (
      <>
        <AppNavigator />
        <PushNotificationsHandler />
      </>
    );
  }

  return <AuthNavigator />;
}
