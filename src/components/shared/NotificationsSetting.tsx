import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, IconBadge } from '@/components/ui';
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
      <View style={styles.row}>
        <IconBadge
          icon={granted ? 'notifications' : 'notifications-off-outline'}
          color={granted ? colors.success : colors.primaryDark}
          background={granted ? colors.successSoft : colors.primarySoft}
          size={44}
        />
        <View style={styles.text}>
          <Text style={styles.label}>Notificações de alertas</Text>
          <Text style={styles.hint}>
            {granted
              ? 'Você será avisado quando surgir um alerta.'
              : 'Receba um aviso quando surgir um alerta.'}
          </Text>
        </View>
        {permission !== null ? (
          <Badge
            label={granted ? 'Ativadas' : 'Desativadas'}
            tone={granted ? 'success' : 'neutral'}
            icon={granted ? 'checkmark-circle' : 'remove-circle-outline'}
          />
        ) : null}
      </View>

      {permission && !granted ? (
        <Button
          title={
            permission.status === 'denied' && !permission.canAskAgain
              ? 'Abrir configurações do sistema'
              : 'Ativar notificações'
          }
          variant="outline"
          icon="notifications-outline"
          onPress={() => void enable()}
          loading={busy}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  label: { ...typography.bodyStrong, color: colors.text },
  hint: { ...typography.caption, lineHeight: 18, color: colors.textMuted },
});
