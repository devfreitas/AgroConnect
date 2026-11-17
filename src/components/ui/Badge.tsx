import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

import type { IconName } from './icons';

export type BadgeTone = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'brand';

const tones: Record<BadgeTone, { background: string; color: string }> = {
  success: { background: colors.successSoft, color: colors.success },
  warning: { background: colors.warningSoft, color: colors.warning },
  error: { background: colors.errorSoft, color: colors.error },
  info: { background: colors.infoSoft, color: colors.info },
  neutral: { background: colors.surfaceMuted, color: colors.textMuted },
  brand: { background: colors.primarySoft, color: colors.primaryDark },
};

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
};

/** Selo compacto com texto (e ícone opcional). O estado nunca depende só da cor. */
export function Badge({ label, tone = 'neutral', icon }: BadgeProps) {
  const { background, color } = tones[tone];

  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
      {icon ? <Ionicons name={icon} size={13} color={color} /> : null}
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  text: { ...typography.caption, fontWeight: '700', lineHeight: 16 },
});
