import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
  }

  return (
    <Screen title="Perfil" subtitle="Sua conta e configurações.">
      <Card style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name ?? '—'}</Text>

        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email ?? '—'}</Text>
      </Card>

      <Button title="Sair da conta" onPress={handleSignOut} variant="outline" loading={signingOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  value: { ...typography.bodyStrong, color: colors.text },
});
