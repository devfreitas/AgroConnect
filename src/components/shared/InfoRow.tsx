import { StyleSheet, Text, View } from 'react-native';

import { IconBadge, type IconName } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

type InfoRowProps = {
  icon: IconName;
  label: string;
  value: string;
  /** Texto de largura fixa (ex.: hash do commit). */
  mono?: boolean;
  selectable?: boolean;
};

/** Linha de informação: ícone, rótulo pequeno e valor. */
export function InfoRow({ icon, label, value, mono, selectable }: InfoRowProps) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${label}: ${value}`}>
      <IconBadge icon={icon} size={40} />
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, mono && styles.mono]} selectable={selectable}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  text: { flex: 1, gap: 2 },
  label: { ...typography.overline, color: colors.textMuted },
  value: { ...typography.bodyStrong, color: colors.text },
  mono: { fontFamily: 'monospace' },
});
