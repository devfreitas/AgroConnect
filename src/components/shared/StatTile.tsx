import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconBadge, type IconName } from '@/components/ui';
import { colors, radius, spacing, typography, withAlpha } from '@/theme';

type StatTileProps = {
  icon: IconName;
  value: string;
  label: string;
  /** Cor do ícone (e do realce). */
  color?: string;
  soft?: string;
  /** `onInk` para usar dentro do cabeçalho escuro. */
  tone?: 'default' | 'onInk';
  onPress?: () => void;
  accessibilityHint?: string;
};

/** Indicador numérico (KPI): ícone, valor grande e rótulo. */
export function StatTile({
  icon,
  value,
  label,
  color = colors.primaryDark,
  soft = colors.primarySoft,
  tone = 'default',
  onPress,
  accessibilityHint,
}: StatTileProps) {
  const onInk = tone === 'onInk';

  const content = (
    <>
      <IconBadge
        icon={icon}
        size={36}
        color={onInk ? colors.accent : color}
        background={onInk ? withAlpha(colors.accent, 0.14) : soft}
      />
      <Text
        style={[styles.value, onInk && styles.valueOnInk]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text style={[styles.label, onInk && styles.labelOnInk]} numberOfLines={2}>
        {label}
      </Text>
    </>
  );

  const style = [styles.tile, onInk ? styles.tileOnInk : styles.tileDefault];

  if (!onPress) {
    return (
      <View style={style} accessible accessibilityLabel={`${label}: ${value}`}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${value}`}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [style, pressed && styles.pressed]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    minWidth: 0,
    gap: spacing.xs,
    padding: spacing.md - 2,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  tileDefault: { backgroundColor: colors.surface, borderColor: colors.border },
  tileOnInk: { backgroundColor: colors.inkRaised, borderColor: withAlpha(colors.accent, 0.18) },
  pressed: { opacity: 0.88 },
  value: {
    ...typography.heading,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.xs,
  },
  valueOnInk: { color: colors.onInk },
  label: { ...typography.caption, lineHeight: 17, color: colors.textMuted },
  labelOnInk: { color: colors.onInkMuted },
});
