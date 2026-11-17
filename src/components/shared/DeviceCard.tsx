import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconBadge } from '@/components/ui';
import { colors, radius, shadows, spacing, typography } from '@/theme';
import type { Device } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { DEVICE_STATUS_LABELS } from '@/utils/readings';

import { SignalBars } from './SignalBars';
import { StatusBadge } from './StatusBadge';

type DeviceCardProps = {
  device: Device;
  onPress: () => void;
};

const statusColor = {
  ONLINE: colors.success,
  UNSTABLE: colors.warning,
  OFFLINE: colors.error,
  UNKNOWN: colors.secondary,
} as const;

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
      <View style={[styles.stripe, { backgroundColor: statusColor[device.status] }]} />

      <View style={styles.top}>
        <IconBadge icon="hardware-chip" size={48} />
        <View style={styles.titles}>
          <Text style={styles.name} numberOfLines={2}>
            {device.name}
          </Text>
          <Text style={styles.code}>{device.code}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      </View>

      <View style={styles.bottom}>
        <StatusBadge status={device.status} />
        <SignalBars rssi={device.rssi} />
      </View>

      <View style={styles.meta}>
        <Ionicons name="time-outline" size={15} color={colors.textMuted} />
        <Text style={styles.metaText}>{lastSeen}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: spacing.md - 2,
    padding: spacing.md,
    paddingLeft: spacing.md + 5,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.sm,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  stripe: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titles: { flex: 1, gap: 2 },
  name: { ...typography.subheading, color: colors.text },
  code: { ...typography.caption, color: colors.textMuted, fontFamily: 'monospace' },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  metaText: { ...typography.caption, color: colors.textMuted, flex: 1 },
});
