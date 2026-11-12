import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { LineChart } from '@/components/shared/LineChart';
import { Screen } from '@/components/shared/Screen';
import { Button, Card, ChipGroup, EmptyState, ErrorState, Loader, Notice } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getHistory, listDevices, listSensors } from '@/services';
import { colors, spacing, typography } from '@/theme';
import type { AnalyticsStackScreenProps } from '@/types/navigation';
import { formatReadingValue, READING_INFO, READING_ORDER } from '@/utils/readings';
import { buildRange, PERIODS, type PeriodKey } from '@/utils/period';

export function AnalyticsScreen({ navigation }: AnalyticsStackScreenProps<'Analytics'>) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [sensorId, setSensorId] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodKey>('24h');

  const { data, error, loading, refreshing, reload, refresh } = useRemoteData(
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
  );

  function renderContent() {
    if (loading) {
      return <Loader message="Carregando histórico..." />;
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
            title="Nenhum dispositivo encontrado"
            description="Quando houver dispositivos vinculados, o histórico aparecerá aqui."
          />
        </Card>
      );
    }

    return (
      <>
        {error ? (
          <Notice type="error" message={`Não foi possível atualizar. ${error.message}`} />
        ) : null}

        {devices.length > 1 ? (
          <ChipGroup
            label="Dispositivo"
            value={device.id}
            options={devices.map((item) => ({ value: item.id, label: item.name }))}
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
            }))}
            onChange={setSensorId}
          />
        ) : null}

        <ChipGroup
          label="Período"
          value={period}
          options={PERIODS.map((item) => ({ value: item.key, label: item.label }))}
          onChange={setPeriod}
        />

        {!sensor ? (
          <Card>
            <EmptyState
              title="Nenhum sensor cadastrado"
              description="Este dispositivo ainda não tem sensores vinculados."
            />
          </Card>
        ) : !history || history.items.length === 0 ? (
          <Card>
            <EmptyState
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
              <Card style={styles.summary}>
                <Summary label="Mínimo" value={formatReadingValue(history.summary.min, history.unit)} />
                <Summary label="Média" value={formatReadingValue(history.summary.avg, history.unit)} />
                <Summary label="Máximo" value={formatReadingValue(history.summary.max, history.unit)} />
              </Card>
            ) : null}

            <Card>
              <Text style={styles.chartTitle}>{READING_INFO[history.type].label}</Text>
              <LineChart points={history.items} unit={history.unit} />
            </Card>
          </>
        )}
      </>
    );
  }

  return (
    <Screen
      title="Análises"
      subtitle="Histórico, gráficos e recomendações."
      onRefresh={refresh}
      refreshing={refreshing}
    >
      <View style={styles.links}>
        <Button title="Ver alertas" variant="outline" onPress={() => navigation.navigate('Alerts')} />
        <Button
          title="Ver recomendações da IA"
          variant="outline"
          onPress={() => navigation.navigate('Recommendations')}
        />
      </View>
      {renderContent()}
    </Screen>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryItem}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  links: { gap: spacing.sm },
  summary: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
  summaryItem: { flex: 1, gap: spacing.xs },
  summaryLabel: { ...typography.label, color: colors.textMuted },
  summaryValue: { ...typography.bodyStrong, color: colors.text },
  chartTitle: { ...typography.subheading, color: colors.text, marginBottom: spacing.sm },
});
