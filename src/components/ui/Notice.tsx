import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type NoticeType = 'success' | 'error' | 'info';

type NoticeProps = {
  type: NoticeType;
  message: string;
};

const config = {
  success: { icon: 'checkmark-circle', color: colors.success, background: colors.successSoft },
  error: { icon: 'alert-circle', color: colors.error, background: colors.errorSoft },
  info: { icon: 'information-circle', color: colors.info, background: colors.infoSoft },
} as const;

/** Aviso de sucesso, erro ou informação. Combina ícone, cor e texto (a cor nunca é o único indicador). */
export function Notice({ type, message }: NoticeProps) {
  const { icon, color, background } = config[type];

  return (
    <View
      style={[styles.container, { backgroundColor: background }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View style={[styles.bar, { backgroundColor: color }]} />
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.md - 2,
    paddingLeft: spacing.md + 4,
    paddingRight: spacing.md,
    borderRadius: radius.md + 2,
    overflow: 'hidden',
  },
  bar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  message: {
    flex: 1,
    ...typography.caption,
    lineHeight: 21,
    color: colors.text,
    fontWeight: '500',
  },
});
