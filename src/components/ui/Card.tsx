import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { colors, radius, spacing } from '@/theme';

type CardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
};

export function Card({ style, children, ...rest }: CardProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
});