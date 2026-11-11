import { StyleSheet, Text, View } from 'react-native';

import { ReadingCard } from '@/components/shared/ReadingCard';
import { Screen } from '@/components/shared/Screen';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, EmptyState, ErrorState, Loader, Notice } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getDevice, getLatestReadings, listSensors } from '@/services';
import { colors, spacing, typography } from '@/theme';
import type { SensorsStackScreenProps } from '@/types/navigation';
import { formatDateTime } from '@/utils/format';
import { READING_INFO, READING_ORDER } from '@/utils/readings';

export function DeviceDetailScreen({ route }: SensorsStackScreenProps<'DeviceDetail'>) {
  const { deviceId } = route.params;

  const { data, error, loading, refreshing, reload, refresh } = useRemoteData(
    async (signal) => {
      const [device, sensors, latest] = await Promise.all([
        getDevice(deviceId, signal),
        listSensors(deviceId, signal),
        getLatestReadings(deviceId, signal),
      ]);
      return { device, sensors, latest };
    },
    [deviceId],
  );

  if (loading) {
    return (
      <Screen title="Dispositivo" safeTop={false}>
        <Loader message="Carregando dispositivo..." />
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
      title={device.name}
      subtitle={device.code}
      safeTop={false}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {error ? (
        <Notice type="error" message={`Não foi possível atualizar. ${error.message}`} />
      ) : null}

      {latest.simulatedData ? (
        <Notice
          type="info"
          message="Dados simulados: as leituras abaixo são fictícias, para demonstração."
        />
      ) : null}

      <Card style={styles.info}>
        <Text style={styles.label}>Estado</Text>
        <StatusBadge status={device.status} />

        <Text style={styles.label}>Último contato</Text>
        <Text style={styles.value}>
          {device.lastSeenAt ? formatDateTime(device.lastSeenAt) : 'Sem contato registrado'}
        </Text>

        <Text style={styles.label}>Sinal (RSSI)</Text>
        <Text style={styles.value}>{device.rssi !== null ? `${device.rssi} dBm` : '—'}</Text>

        <Text style={styles.label}>Firmware</Text>
        <Text style={styles.value}>{device.firmwareVersion}</Text>
      </Card>

      <Text style={styles.section} accessibilityRole="header">
        Sensores
      </Text>

      {sorted.length === 0 ? (
        <Card>
          <EmptyState
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
              <View>
                <Text style={styles.sensorName}>{sensor.label || READING_INFO[sensor.type].label}</Text>
                <Text style={styles.value}>Sem leitura registrada</Text>
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  info: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  value: { ...typography.bodyStrong, color: colors.text },
  section: { ...typography.heading, color: colors.text },
  noReading: { gap: spacing.xs },
  sensorName: { ...typography.label, color: colors.textMuted },
});
