import { Loader } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <Loader fullScreen message="Verificando sua sessão..." />;
  }

  return status === 'authenticated' ? <AppNavigator /> : <AuthNavigator />;
}