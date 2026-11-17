import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Card, IconBadge } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';
import type { Reading } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import {
  formatReadingValue,
  PERCENT_TYPES,
  QUALITY_LABELS,
  READING_INFO,
  READING_TONE,
} from '@/utils/readings';

import { Sparkline } from './Sparkline';

type ReadingCardProps = {
  reading: Reading;
  /** Últimos valores (mais antigo primeiro) para o mini gráfico de tendência. */
  trend?: (number | null)[];
  /** `tile` ocupa meia largura (grade); `wide` ocupa a linha inteira. */
  layout?: 'tile' | 'wide';
};

/** Valor atual de um sensor, com a qualidade da leitura em texto e ícone (não só cor). */
export function ReadingCard({ reading, trend, layout = 'wide' }: ReadingCardProps) {
  const info = READING_INFO[reading.type];
  const tone = READING_TONE[reading.type];
  const valid = reading.quality === 'VALID';
  const qualityColor = valid ? colors.success : colors.warning;
  const valueText = formatReadingValue(reading.value, reading.unit);
  const qualityText = QUALITY_LABELS[reading.quality];
  const showBar = PERCENT_TYPES.includes(reading.type) && reading.value !== null;
  const tile = layout === 'tile';

  return (
    <Card
      variant="raised"
      style={[styles.card, tile && styles.tile]}
      accessible
      accessibilityLabel={`${info.label}: ${valueText}. ${qualityText}. Atualizado em ${formatDateTime(reading.recordedAt)}.`}
    >
      <View style={styles.header}>
        <IconBadge
          icon={info.icon}
          color={tone.color}
          background={tone.soft}
          size={tile ? 36 : 44}
        />
        <Text style={styles.label} numberOfLines={2}>
          {info.label}
        </Text>
      </View>

      <Text style={[styles.value, tile && styles.valueTile]} numberOfLines={1} adjustsFontSizeToFit>
        {valueText}
      </Text>

      {showBar ? (
        <View
          style={styles.track}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View
            style={[
              styles.fill,
              {
                width: `${Math.min(Math.max(reading.value ?? 0, 0), 100)}%`,
                backgroundColor: tone.color,
              },
            ]}
          />
        </View>
      ) : null}

      {trend && trend.length > 1 ? <Sparkline values={trend} color={tone.color} /> : null}

      <View style={styles.quality}>
        <Ionicons name={valid ? 'checkmark-circle' : 'warning'} size={15} color={qualityColor} />
        <Text style={[styles.qualityText, { color: qualityColor }]} numberOfLines={2}>
          {qualityText}
        </Text>
      </View>

      {!tile ? (
        <Text style={styles.time}>Atualizado em {formatDateTime(reading.recordedAt)}</Text>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm },
  tile: { flex: 1, minWidth: 0, padding: spacing.md - 2 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { ...typography.label, flex: 1, color: colors.textMuted },
  value: { ...typography.metric, color: colors.text },
  valueTile: { fontSize: 26, lineHeight: 32 },
  track: {
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.full },
  quality: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xs },
  qualityText: { ...typography.caption, lineHeight: 17, fontWeight: '700', flex: 1 },
  time: { ...typography.caption, color: colors.textMuted },
});
