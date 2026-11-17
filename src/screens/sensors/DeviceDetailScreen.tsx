import { StyleSheet, Text, View } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { InfoRow } from '@/components/shared/InfoRow';
import { ReadingCard } from '@/components/shared/ReadingCard';
import { Screen } from '@/components/shared/Screen';
import { SignalBars } from '@/components/shared/SignalBars';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Card,
  EmptyState,
  ErrorState,
  Notice,
  SectionHeader,
  SkeletonCards,
} from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getDevice, getLatestReadings, listSensors } from '@/services';
import { colors, spacing, typography } from '@/theme';
import type { SensorsStackScreenProps } from '@/types/navigation';
import { formatDateTime } from '@/utils/format';
import { READING_INFO, READING_ORDER } from '@/utils/readings';

export function DeviceDetailScreen({ route }: SensorsStackScreenProps<'DeviceDetail'>) {
  const { deviceId } = route.params;

  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } = useRemoteData(
    async (signal) => {
      const [device, sensors, latest] = await Promise.all([
        getDevice(deviceId, signal),
        listSensors(deviceId, signal),
        getLatestReadings(deviceId, signal),
      ]);
      return { device, sensors, latest };
    },
    [deviceId],
    { cacheKey: `device:${deviceId}` },
  );

  if (loading) {
    return (
      <Screen title="Dispositivo" safeTop={false}>
        <SkeletonCards count={3} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen title="Dispositivo" safeTop={false}>
        <ErrorState
          title="Não foi possível carregar o dispositivo"
          message={error?.message}
          onRetry={reload}
        />
      </Screen>
    );
  }

  const { device, sensors, latest } = data;

  const sorted = [...sensors].sort(
    (a, b) => READING_ORDER.indexOf(a.type) - READING_ORDER.indexOf(b.type),
  );

  return (
    <Screen
      eyebrow={device.code}
      title={device.name}
      subtitle={
        device.lastSeenAt
          ? `Último contato em ${formatDateTime(device.lastSeenAt)}`
          : 'Sem contato registrado'
      }
      safeTop={false}
      onRefresh={refresh}
      refreshing={refreshing}
      hero={
        <View style={styles.heroRow}>
          <StatusBadge status={device.status} />
          <SignalBars rssi={device.rssi} showValue />
        </View>
      }
    >
      <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />

      {latest.simulatedData ? (
        <Notice
          type="info"
          message="Dados simulados: as leituras abaixo são fictícias, para demonstração."
        />
      ) : null}

      <SectionHeader title="Sensores" />

      {sorted.length === 0 ? (
        <Card>
          <EmptyState
            iconName="hardware-chip-outline"
            title="Nenhum sensor cadastrado"
            description="Este dispositivo ainda não tem sensores vinculados."
          />
        </Card>
      ) : (
        sorted.map((sensor) => {
          const reading = latest.readings.find((item) => item.sensorId === sensor.id);

          return reading ? (
            <ReadingCard key={sensor.id} reading={reading} />
          ) : (
            <Card key={sensor.id} style={styles.noReading}>
              <Text style={styles.sensorName}>
                {sensor.label || READING_INFO[sensor.type].label}
              </Text>
              <Text style={styles.value}>Sem leitura registrada</Text>
            </Card>
          );
        })
      )}

      <SectionHeader title="Informações técnicas" />
      <Card style={styles.info}>
        <InfoRow
          icon="wifi-outline"
          label="Sinal (RSSI)"
          value={device.rssi !== null ? `${device.rssi} dBm` : '—'}
        />
        <View style={styles.divider} />
        <InfoRow icon="code-slash-outline" label="Firmware" value={device.firmwareVersion} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  info: { gap: spacing.xs },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 56 },
  noReading: { gap: spacing.xs },
  sensorName: { ...typography.label, color: colors.textMuted },
  value: { ...typography.bodyStrong, color: colors.text },
});
