import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, StyleSheet, Text } from 'react-native';

import { Button, Card } from '@/components/ui';
import {
  getPushPermission,
  registerPushToken,
  requestPushPermission,
  type PushPermission,
} from '@/services';
import { colors, spacing, typography } from '@/theme';

/** Mostra se as notificações estão ativas e permite ativá-las. */
export function NotificationsSetting() {
  const [permission, setPermission] = useState<PushPermission | null>(null);
  const [busy, setBusy] = useState(false);

  const refreshPermission = useCallback(async () => {
    try {
      setPermission(await getPushPermission());
    } catch {
      setPermission(null);
    }
  }, []);

  // Atualiza ao abrir a tela e ao voltar das configurações do sistema.
  useFocusEffect(
    useCallback(() => {
      void refreshPermission();
    }, [refreshPermission]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshPermission();
    });
    return () => subscription.remove();
  }, [refreshPermission]);

  async function enable() {
    if (!permission) return;
    setBusy(true);

    try {
      if (permission.status === 'denied' && !permission.canAskAgain) {
        await Linking.openSettings();
        return;
      }

      const next = await requestPushPermission();
      setPermission(next);

      if (next.status === 'granted') {
        await registerPushToken().catch(() => false);
      }
    } finally {
      setBusy(false);
    }
  }

  const granted = permission?.status === 'granted';

  return (
    <Card style={styles.card}>
      <Text style={styles.label}>Notificações de alertas</Text>
      <Text style={styles.value}>
        {permission === null ? '—' : granted ? 'Ativadas' : 'Desativadas'}
      </Text>
      {permission && !granted ? (
        <Button
          title={
            permission.status === 'denied' && !permission.canAskAgain
              ? 'Abrir configurações do sistema'
              : 'Ativar notificações'
          }
          variant="outline"
          onPress={() => void enable()}
          loading={busy}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textMuted },
  value: { ...typography.bodyStrong, color: colors.text, marginBottom: spacing.xs },
});
