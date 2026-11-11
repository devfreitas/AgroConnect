import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';

type NoticeType = 'success' | 'error';

type NoticeProps = {
  type: NoticeType;
  message: string;
};

const config = {
  success: { icon: 'checkmark-circle', color: colors.success },
  error: { icon: 'alert-circle', color: colors.error },
} as const;

/** Aviso de sucesso ou erro. Combina ícone, cor e texto (a cor nunca é o único indicador). */
export function Notice({ type, message }: NoticeProps) {
  const { icon, color } = config[type];

  return (
    <View
      style={[styles.container, { borderColor: color }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
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
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1.5,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  message: { flex: 1, ...typography.body, color: colors.text },
});
