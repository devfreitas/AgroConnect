import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, Card, IconBadge } from '@/components/ui';
import { colors, radius, spacing, typography } from '@/theme';
import type { AlertSeverity, ReadingSnapshot } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { formatReadingValue, READING_INFO } from '@/utils/readings';
import { SEVERITY_INFO, SEVERITY_SOFT } from '@/utils/severity';

type InsightCardProps = {
  severity: AlertSeverity;
  title: string;
  message: string;
  reason: string;
  basedOn: ReadingSnapshot[];
  /** Data de criação ou geração. */
  date: string;
  /** Texto de status ao lado da severidade (ex.: "Não lido"). */
  statusLabel?: string;
  disclaimer?: string;
  /** Destaque maior (ex.: a recomendação de maior prioridade). */
  emphasis?: boolean;
  /** Ação do cartão (ex.: botão "Marcar como lido"). */
  footer?: ReactNode;
};

const severityTone = { INFO: 'info', WARNING: 'warning', CRITICAL: 'error' } as const;

/** Cartão explicável usado por alertas e recomendações: o quê, por quê e em quais leituras se baseia. */
export function InsightCard({
  severity,
  title,
  message,
  reason,
  basedOn,
  date,
  statusLabel,
  disclaimer,
  emphasis = false,
  footer,
}: InsightCardProps) {
  const info = SEVERITY_INFO[severity];
  const unread = statusLabel === 'Não lido';

  return (
    <Card variant="raised" accentColor={info.color} style={styles.card}>
      <View style={styles.header}>
        <IconBadge
          icon={info.icon}
          color={info.color}
          background={SEVERITY_SOFT[severity]}
          size={emphasis ? 52 : 44}
        />
        <View style={styles.badges}>
          <Badge label={info.label} tone={severityTone[severity]} icon={info.icon} />
          {statusLabel ? (
            <Badge
              label={statusLabel}
              tone={unread ? 'brand' : 'neutral'}
              icon={unread ? 'ellipse' : 'checkmark'}
            />
          ) : null}
        </View>
      </View>

      <Text style={[styles.title, emphasis && styles.titleEmphasis]}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <View style={styles.why}>
        <View style={styles.whyHeader}>
          <Ionicons name="bulb-outline" size={16} color={colors.primaryDark} />
          <Text style={styles.label}>Por quê</Text>
        </View>
        <Text style={styles.body}>{reason}</Text>
      </View>

      {basedOn.length > 0 ? (
        <View style={styles.based}>
          <Text style={styles.label}>Baseado em</Text>
          <View style={styles.readings}>
            {basedOn.map((item) => (
              <View
                key={`${item.type}-${item.recordedAt}`}
                style={styles.reading}
                accessible
                accessibilityLabel={`${READING_INFO[item.type].label}: ${formatReadingValue(item.value, item.unit)}, ${formatDateTime(item.recordedAt)}`}
              >
                <Ionicons
                  name={READING_INFO[item.type].icon}
                  size={16}
                  color={colors.primaryDark}
                />
                <View>
                  <Text style={styles.readingValue}>
                    {formatReadingValue(item.value, item.unit)}
                  </Text>
                  <Text style={styles.readingMeta}>
                    {READING_INFO[item.type].label} · {formatDateTime(item.recordedAt)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {disclaimer ? (
        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
          <Text style={styles.disclaimerText}>{disclaimer}</Text>
        </View>
      ) : null}

      <View style={styles.dateRow}>
        <Ionicons name="time-outline" size={14} color={colors.textMuted} />
        <Text style={styles.date}>{formatDateTime(date)}</Text>
      </View>

      {footer}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.sm + 2, paddingLeft: spacing.md + 6 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badges: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs + 2 },
  title: { ...typography.subheading, color: colors.text },
  titleEmphasis: { ...typography.heading },
  message: { ...typography.body, color: colors.text },
  why: {
    gap: spacing.xs,
    padding: spacing.md - 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  whyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  label: { ...typography.overline, color: colors.textMuted },
  body: { ...typography.caption, lineHeight: 21, color: colors.text },
  based: { gap: spacing.sm },
  readings: { gap: spacing.sm },
  reading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  readingValue: { ...typography.bodyStrong, color: colors.text, lineHeight: 20 },
  readingMeta: { ...typography.caption, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  disclaimer: { flexDirection: 'row', gap: spacing.xs + 2, alignItems: 'flex-start' },
  disclaimerText: {
    ...typography.caption,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
    flex: 1,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2 },
  date: { ...typography.caption, fontSize: 12, color: colors.textMuted },
});
