import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '@/theme';
import type { Property } from '@/types/domain';
import { formatHectares } from '@/utils/format';

type PropertyCardProps = {
  property: Property;
  onPress: () => void;
};

export function PropertyCard({ property, onPress }: PropertyCardProps) {
  const location = `${property.city}, ${property.state}`;
  const area = formatHectares(property.areaHectares);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${property.name}, ${location}, ${area}`}
      accessibilityHint="Abre os detalhes da propriedade"
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Text style={styles.name}>{property.name}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{location}</Text>
        <Text style={styles.metaText}>{area}</Text>
      </View>
      {property.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {property.description}
        </Text>
      ) : null}
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
  meta: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  metaText: { ...typography.caption, color: colors.textMuted },
  description: { ...typography.body, color: colors.text },
});
