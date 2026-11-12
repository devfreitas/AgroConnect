import { useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { NotificationsSetting } from '@/components/shared/NotificationsSetting';
import { Screen } from '@/components/shared/Screen';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';
import type { ProfileStackScreenProps } from '@/types/navigation';
import { formatDate } from '@/utils/format';

export function ProfileScreen({ navigation }: ProfileStackScreenProps<'Profile'>) {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  function confirmSignOut() {
    Alert.alert('Sair da conta', 'Deseja sair do AgroConnect neste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          setSigningOut(true);
          void signOut();
        },
      },
    ]);
  }

  return (
    <Screen title="Perfil" subtitle="Sua conta e informações do app.">
      <Card style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name ?? '—'}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>

        {user?.createdAt ? (
          <>
            <Text style={styles.label}>Conta criada em</Text>
            <Text style={styles.value}>{formatDate(user.createdAt)}</Text>
          </>
        ) : null}
      </Card>

      <NotificationsSetting />

      <Button
        title="Sobre o App"
        variant="outline"
        onPress={() => navigation.navigate('About')}
        disabled={signingOut}
      />
      <Button title="Sair da conta" onPress={confirmSignOut} variant="danger" loading={signingOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  value: { ...typography.bodyStrong, color: colors.text },
});
