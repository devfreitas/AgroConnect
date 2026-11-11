import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import type { DeviceStatus } from '@/types/domain';
import { DEVICE_STATUS_LABELS } from '@/utils/readings';

const statusStyle = {
  ONLINE: { icon: 'checkmark-circle', color: colors.success },
  UNSTABLE: { icon: 'warning', color: colors.warning },
  OFFLINE: { icon: 'close-circle', color: colors.error },
  UNKNOWN: { icon: 'help-circle', color: colors.textMuted },
} as const;

/** Estado do dispositivo em ícone e texto (a cor nunca é o único indicador). */
export function StatusBadge({ status }: { status: DeviceStatus }) {
  const { icon, color } = statusStyle[status];

  return (
    <View style={styles.badge}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.text, { color }]}>{DEVICE_STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  text: { ...typography.caption, fontWeight: '600' },
});
