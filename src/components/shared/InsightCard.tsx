import { Ionicons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import type { AlertSeverity, ReadingSnapshot } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { formatReadingValue, READING_INFO } from '@/utils/readings';
import { SEVERITY_INFO } from '@/utils/severity';

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
  /** Ação do cartão (ex.: botão "Marcar como lido"). */
  footer?: ReactNode;
};

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
  footer,
}: InsightCardProps) {
  const info = SEVERITY_INFO[severity];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={info.icon} size={20} color={info.color} />
        <Text style={[styles.severity, { color: info.color }]}>{info.label}</Text>
        {statusLabel ? <Text style={styles.status}>· {statusLabel}</Text> : null}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      <Text style={styles.label}>Por quê</Text>
      <Text style={styles.body}>{reason}</Text>

      {basedOn.length > 0 ? (
        <>
          <Text style={styles.label}>Baseado em</Text>
          {basedOn.map((item) => (
            <Text key={`${item.type}-${item.recordedAt}`} style={styles.body}>
              {READING_INFO[item.type].label}: {formatReadingValue(item.value, item.unit)} (
              {formatDateTime(item.recordedAt)})
            </Text>
          ))}
        </>
      ) : null}

      {disclaimer ? <Text style={styles.disclaimer}>{disclaimer}</Text> : null}
      <Text style={styles.date}>{formatDateTime(date)}</Text>

      {footer}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  severity: { ...typography.label, fontWeight: '700' },
  status: { ...typography.caption, color: colors.textMuted },
  title: { ...typography.subheading, color: colors.text },
  message: { ...typography.body, color: colors.text },
  label: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  body: { ...typography.body, color: colors.text },
  disclaimer: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  date: { ...typography.caption, color: colors.textMuted },
});
