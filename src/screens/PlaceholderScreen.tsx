import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';

export function PlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>AgroConnect</Text>
      <Text style={styles.subtitle}>Tecnologia acessível. Agricultura inteligente.</Text>
      <View style={styles.swatches}>
        <View style={[styles.swatch, { backgroundColor: colors.primary }]} />
        <View style={[styles.swatch, { backgroundColor: colors.accent }]} />
        <View style={[styles.swatch, { backgroundColor: colors.secondary }]} />
        <View style={[styles.swatch, { backgroundColor: colors.text }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  title: { ...typography.display, color: colors.primary },
  subtitle: {
    ...typography.body,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  swatches: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  swatch: { width: 40, height: 40, borderRadius: 20 },
});