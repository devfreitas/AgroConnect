import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { Device } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { DEVICE_STATUS_LABELS } from '@/utils/readings';

import { StatusBadge } from './StatusBadge';

type DeviceCardProps = {
  device: Device;
  onPress: () => void;
};

export function DeviceCard({ device, onPress }: DeviceCardProps) {
  const lastSeen = device.lastSeenAt
    ? `Último contato em ${formatDateTime(device.lastSeenAt)}`
    : 'Sem contato registrado';

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${device.name}, ${DEVICE_STATUS_LABELS[device.status]}. ${lastSeen}`}
      accessibilityHint="Abre os detalhes e sensores do dispositivo"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.name}>{device.name}</Text>
      <Text style={styles.code}>{device.code}</Text>
      <StatusBadge status={device.status} />
      <Text style={styles.meta}>{lastSeen}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: spacing.xs,
    padding: spacing.md,
    minHeight: 48,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.85 },
  name: { ...typography.subheading, color: colors.text },
  code: { ...typography.caption, color: colors.textMuted },
  meta: { ...typography.caption, color: colors.textMuted },
});
