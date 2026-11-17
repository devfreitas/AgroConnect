import { StyleSheet, View } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { DeviceCard } from '@/components/shared/DeviceCard';
import { Screen } from '@/components/shared/Screen';
import { StatTile } from '@/components/shared/StatTile';
import { Card, EmptyState, ErrorState, SkeletonCards } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { listDevices } from '@/services';
import { spacing } from '@/theme';
import type { SensorsStackScreenProps } from '@/types/navigation';

export function SensorsScreen({ navigation }: SensorsStackScreenProps<'Sensors'>) {
  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } = useRemoteData(
    listDevices,
    [],
    {
      cacheKey: 'devices',
    },
  );

  const online = data?.filter((device) => device.status === 'ONLINE').length ?? 0;
  const attention =
    data?.filter((device) => device.status === 'UNSTABLE' || device.status === 'OFFLINE').length ??
    0;

  const hero = data ? (
    <View style={styles.kpis}>
      <StatTile
        tone="onInk"
        icon="hardware-chip-outline"
        value={String(data.length)}
        label="Dispositivos"
      />
      <StatTile
        tone="onInk"
        icon="checkmark-circle-outline"
        value={String(online)}
        label="Online"
      />
      <StatTile
        tone="onInk"
        icon="warning-outline"
        value={String(attention)}
        label="Instáveis ou offline"
      />
    </View>
  ) : null;

  function renderContent() {
    if (loading) {
      return <SkeletonCards count={3} />;
    }

    if (!data) {
      return (
        <ErrorState
          title="Não foi possível carregar os dispositivos"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    if (data.length === 0) {
      return (
        <Card>
          <EmptyState
            iconName="hardware-chip-outline"
            title="Nenhum dispositivo encontrado"
            description="Os dispositivos e sensores vinculados aparecerão aqui."
          />
        </Card>
      );
    }

    return (
      <>
        <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />
        {data.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onPress={() => navigation.navigate('DeviceDetail', { deviceId: device.id })}
          />
        ))}
      </>
    );
  }

  return (
    <Screen
      eyebrow="Dispositivos IoT"
      title="Sensores"
      subtitle="Estado de cada dispositivo e suas leituras."
      hero={hero}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: spacing.sm },
});
