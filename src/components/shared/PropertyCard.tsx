import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, IconBadge } from '@/components/ui';
import { colors, radius, shadows, spacing, typography } from '@/theme';
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
      <View style={styles.top}>
        <IconBadge icon="leaf" size={52} />
        <View style={styles.titles}>
          <Text style={styles.name} numberOfLines={2}>
            {property.name}
          </Text>
          <View style={styles.location}>
            <Ionicons name="location-outline" size={15} color={colors.textMuted} />
            <Text style={styles.locationText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      </View>

      {property.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {property.description}
        </Text>
      ) : null}

      <View style={styles.footer}>
        <Badge label={area} tone="brand" icon="resize-outline" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignSelf: 'stretch',
    gap: spacing.sm + 2,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titles: { flex: 1, gap: 3 },
  name: { ...typography.subheading, color: colors.text },
  location: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  locationText: { ...typography.caption, color: colors.textMuted, flex: 1 },
  description: { ...typography.caption, lineHeight: 21, color: colors.text },
  footer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
