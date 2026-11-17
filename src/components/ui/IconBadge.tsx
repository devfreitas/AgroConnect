import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

import type { IconName } from './icons';

type IconBadgeProps = {
  icon: IconName;
  color?: string;
  background?: string;
  size?: number;
};

/** Ícone dentro de um quadrado arredondado de cor suave. Decorativo: o texto vizinho explica. */
export function IconBadge({
  icon,
  color = colors.primaryDark,
  background = colors.primarySoft,
  size = 44,
}: IconBadgeProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.box,
        { width: size, height: size, backgroundColor: background, borderRadius: size * 0.34 },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
});
