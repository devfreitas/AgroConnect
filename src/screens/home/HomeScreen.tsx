import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ReadingCard } from '@/components/shared/ReadingCard';
import { Screen } from '@/components/shared/Screen';
import { Card, EmptyState, ErrorState, Loader, Notice } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getLatestReadings, listDevices } from '@/services';
import { colors, radius, spacing, typography } from '@/theme';
import type { Device, LatestReadings } from '@/types/domain';
import { formatDateTime } from '@/utils/format';
import { DEVICE_STATUS_LABELS, READING_ORDER } from '@/utils/readings';

type Overview = {
  devices: Device[];
  selected: Device | null;
  latest: LatestReadings | null;
};

export function HomeScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, error, loading, refreshing, updatedAt, reload, refresh } =
    useRemoteData<Overview>(
      async (signal) => {
        const devices = await listDevices(signal);
        const selected = devices.find((device) => device.id === selectedId) ?? devices[0] ?? null;
        const latest = selected ? await getLatestReadings(selected.id, signal) : null;
        return { devices, selected, latest };
      },
      [selectedId],
    );

  function renderContent() {
    if (loading) {
      return <Loader message="Carregando condições da plantação..." />;
    }

    if (!data) {
      return (
        <ErrorState
          title="Não foi possível carregar as leituras"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    const { devices, selected, latest } = data;

    if (!selected) {
      return (
        <Card>
          <EmptyState
            title="Nenhum dispositivo cadastrado"
            description="Quando houver um dispositivo vinculado à sua conta, as leituras aparecerão aqui."
          />
        </Card>
      );
    }

    const readings = READING_ORDER.map((type) =>
      latest?.readings.find((reading) => reading.type === type),
    ).filter((reading) => reading !== undefined);

    return (
      <>
        {error ? (
          <Notice type="error" message={`Não foi possível atualizar. ${error.message}`} />
        ) : null}

        {latest?.simulatedData ? (
          <Notice
            type="info"
            message="Dados simulados: as leituras abaixo são fictícias, para demonstração."
          />
        ) : null}

        {devices.length > 1 ? (
          <View style={styles.chips} accessibilityRole="radiogroup">
            {devices.map((device) => {
              const active = device.id === selected.id;
              return (
                <Pressable
                  key={device.id}
                  onPress={() => setSelectedId(device.id)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: active }}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {device.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        <Card style={styles.device}>
          <Ionicons name="hardware-chip" size={22} color={colors.primary} />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{selected.name}</Text>
            <Text style={styles.deviceStatus}>
              {DEVICE_STATUS_LABELS[selected.status]}
              {selected.lastSeenAt
                ? ` · visto em ${formatDateTime(selected.lastSeenAt)}`
                : ''}
            </Text>
          </View>
        </Card>

        {readings.length === 0 ? (
          <Card>
            <EmptyState
              title="Nenhuma leitura disponível"
              description="Este dispositivo ainda não enviou leituras."
            />
          </Card>
        ) : (
          readings.map((reading) => <ReadingCard key={reading.sensorId} reading={reading} />)
        )}

        {updatedAt ? (
          <Text style={styles.updated}>Atualizado às {formatDateTime(updatedAt)}</Text>
        ) : null}
      </>
    );
  }

  return (
    <Screen
      title="Início"
      subtitle="Resumo das condições da sua plantação."
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary },
  chipText: { ...typography.label, color: colors.text },
  chipTextActive: { color: colors.primaryContrast },
  device: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deviceInfo: { flex: 1 },
  deviceName: { ...typography.bodyStrong, color: colors.text },
  deviceStatus: { ...typography.caption, color: colors.textMuted },
  updated: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
});
