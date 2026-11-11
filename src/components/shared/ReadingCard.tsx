import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import type { Reading } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { formatReadingValue, QUALITY_LABELS, READING_INFO } from '@/utils/readings';

type ReadingCardProps = {
  reading: Reading;
};

/** Valor atual de um sensor, com a qualidade da leitura em texto e ícone (não só cor). */
export function ReadingCard({ reading }: ReadingCardProps) {
  const info = READING_INFO[reading.type];
  const valid = reading.quality === 'VALID';
  const qualityColor = valid ? colors.success : colors.warning;
  const valueText = formatReadingValue(reading.value, reading.unit);
  const qualityText = QUALITY_LABELS[reading.quality];

  return (
    <Card
      style={styles.card}
      accessible
      accessibilityLabel={`${info.label}: ${valueText}. ${qualityText}. Atualizado em ${formatDateTime(reading.recordedAt)}.`}
    >
      <View style={styles.header}>
        <Ionicons name={info.icon} size={22} color={colors.primary} />
        <Text style={styles.label}>{info.label}</Text>
      </View>

      <Text style={styles.value}>{valueText}</Text>

      <View style={styles.quality}>
        <Ionicons
          name={valid ? 'checkmark-circle' : 'warning'}
          size={16}
          color={qualityColor}
        />
        <Text style={[styles.qualityText, { color: qualityColor }]}>{qualityText}</Text>
      </View>

      <Text style={styles.time}>Atualizado em {formatDateTime(reading.recordedAt)}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { ...typography.label, color: colors.textMuted },
  value: { ...typography.display, color: colors.text },
  quality: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  qualityText: { ...typography.caption, fontWeight: '600' },
  time: { ...typography.caption, color: colors.textMuted },
});
