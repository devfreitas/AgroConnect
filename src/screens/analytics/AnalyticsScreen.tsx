import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { LineChart } from '@/components/shared/LineChart';
import { DataStatus } from '@/components/shared/DataStatus';
import { Screen } from '@/components/shared/Screen';
import {
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  IconBadge,
  Notice,
  SkeletonCards,
} from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getHistory, listDevices, listSensors } from '@/services';
import { colors, radius, spacing, typography, withAlpha } from '@/theme';
import type { AnalyticsStackScreenProps } from '@/types/navigation';
import { formatReadingValue, READING_INFO, READING_ORDER, READING_TONE } from '@/utils/readings';
import { buildRange, PERIODS, type PeriodKey } from '@/utils/period';

export function AnalyticsScreen({ navigation }: AnalyticsStackScreenProps<'Analytics'>) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [sensorId, setSensorId] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodKey>('24h');

  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } = useRemoteData(
    async (signal) => {
      const devices = await listDevices(signal);
      const device = devices.find((item) => item.id === deviceId) ?? devices[0] ?? null;
      if (!device) return { devices, device: null, sensors: [], sensor: null, history: null };

      const sensors = (await listSensors(device.id, signal)).sort(
        (a, b) => READING_ORDER.indexOf(a.type) - READING_ORDER.indexOf(b.type),
      );
      const sensor = sensors.find((item) => item.id === sensorId) ?? sensors[0] ?? null;
      if (!sensor) return { devices, device, sensors, sensor: null, history: null };

      const history = await getHistory(
        device.id,
        { sensorId: sensor.id, ...buildRange(period) },
        signal,
      );
      return { devices, device, sensors, sensor, history };
    },
    [deviceId, sensorId, period],
    { cacheKey: `analytics:${deviceId}:${sensorId}:${period}` },
  );

  function renderContent() {
    if (loading) {
      return <SkeletonCards count={2} />;
    }

    if (!data) {
      return (
        <ErrorState
          title="Não foi possível carregar o histórico"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    const { devices, device, sensors, sensor, history } = data;

    if (!device) {
      return (
        <Card>
          <EmptyState
            iconName="hardware-chip-outline"
            title="Nenhum dispositivo encontrado"
            description="Quando houver dispositivos vinculados, o histórico aparecerá aqui."
          />
        </Card>
      );
    }

    return (
      <>
        <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />

        {devices.length > 1 ? (
          <ChipGroup
            label="Dispositivo"
            value={device.id}
            options={devices.map((item) => ({
              value: item.id,
              label: item.name,
              icon: 'hardware-chip-outline' as const,
            }))}
            onChange={(value) => {
              setDeviceId(value);
              setSensorId(null);
            }}
          />
        ) : null}

        {sensor ? (
          <ChipGroup
            label="Sensor"
            value={sensor.id}
            options={sensors.map((item) => ({
              value: item.id,
              label: READING_INFO[item.type].label,
              icon: READING_INFO[item.type].icon,
            }))}
            onChange={setSensorId}
          />
        ) : null}

        <ChipGroup
          label="Período"
          value={period}
          options={PERIODS.map((item) => ({ value: item.key, label: item.label }))}
          onChange={setPeriod}
          variant="segmented"
        />

        {!sensor ? (
          <Card>
            <EmptyState
              iconName="hardware-chip-outline"
              title="Nenhum sensor cadastrado"
              description="Este dispositivo ainda não tem sensores vinculados."
            />
          </Card>
        ) : !history || history.items.length === 0 ? (
          <Card>
            <EmptyState
              iconName="analytics-outline"
              title="Sem dados no período"
              description="Não há leituras para este sensor no período escolhido. Tente um período maior."
            />
          </Card>
        ) : (
          <>
            {history.simulatedData ? (
              <Notice
                type="info"
                message="Dados simulados: o histórico abaixo é fictício, para demonstração."
              />
            ) : null}

            {history.summary ? (
              <View style={styles.summary}>
                <Summary
                  icon="trending-down"
                  label="Mínimo"
                  value={formatReadingValue(history.summary.min, history.unit)}
                  color={READING_TONE[history.type].color}
                />
                <Summary
                  icon="analytics"
                  label="Média"
                  value={formatReadingValue(history.summary.avg, history.unit)}
                  color={READING_TONE[history.type].color}
                />
                <Summary
                  icon="trending-up"
                  label="Máximo"
                  value={formatReadingValue(history.summary.max, history.unit)}
                  color={READING_TONE[history.type].color}
                />
              </View>
            ) : null}

            <Card variant="raised">
              <View style={styles.chartHeader}>
                <IconBadge
                  icon={READING_INFO[history.type].icon}
                  color={READING_TONE[history.type].color}
                  background={READING_TONE[history.type].soft}
                  size={40}
                />
                <Text style={styles.chartTitle}>{READING_INFO[history.type].label}</Text>
              </View>
              <LineChart
                points={history.items}
                unit={history.unit}
                color={READING_TONE[history.type].color}
              />
            </Card>
          </>
        )}
      </>
    );
  }

  return (
    <Screen
      eyebrow="Histórico e inteligência"
      title="Análises"
      subtitle="Gráficos das leituras, alertas e recomendações."
      onRefresh={refresh}
      refreshing={refreshing}
      hero={
        <View style={styles.shortcuts}>
          <Shortcut
            icon="notifications-outline"
            title="Alertas"
            text="Avisos sobre a plantação"
            onPress={() => navigation.navigate('Alerts')}
          />
          <Shortcut
            icon="sparkles-outline"
            title="Recomendações"
            text="Sugestões da IA"
            onPress={() => navigation.navigate('Recommendations')}
          />
        </View>
      }
    >
      {renderContent()}
    </Screen>
  );
}

function Shortcut({
  icon,
  title,
  text,
  onPress,
}: {
  icon: 'notifications-outline' | 'sparkles-outline';
  title: string;
  text: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${text}`}
      style={({ pressed }) => [styles.shortcut, pressed && styles.pressed]}
    >
      <View style={styles.shortcutTop}>
        <IconBadge icon={icon} size={40} color={colors.ink} background={colors.accent} />
        <Ionicons name="arrow-forward" size={18} color={colors.accent} />
      </View>
      <Text style={styles.shortcutTitle} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </Text>
      <Text style={styles.shortcutSub} numberOfLines={2}>
        {text}
      </Text>
    </Pressable>
  );
}

function Summary({
  icon,
  label,
  value,
  color,
}: {
  icon: 'trending-down' | 'analytics' | 'trending-up';
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.summaryItem} accessible accessibilityLabel={`${label}: ${value}`}>
      <Ionicons name={icon} size={18} color={color} />
      <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shortcuts: { flexDirection: 'row', gap: spacing.sm },
  shortcut: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    padding: spacing.md - 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(colors.accent, 0.2),
    backgroundColor: colors.inkRaised,
  },
  shortcutTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  shortcutTitle: { ...typography.bodyStrong, color: colors.onInk },
  shortcutSub: { ...typography.caption, fontSize: 12, lineHeight: 16, color: colors.onInkMuted },
  pressed: { opacity: 0.88 },
  summary: { flexDirection: 'row', gap: spacing.sm },
  summaryItem: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    padding: spacing.md - 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  summaryValue: {
    ...typography.heading,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: colors.text,
  },
  summaryLabel: { ...typography.overline, color: colors.textMuted },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    marginBottom: spacing.md,
  },
  chartTitle: { ...typography.subheading, color: colors.text, flex: 1 },
});
