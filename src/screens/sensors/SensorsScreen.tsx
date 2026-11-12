import { DeviceCard } from '@/components/shared/DeviceCard';
import { DataStatus } from '@/components/shared/DataStatus';
import { Screen } from '@/components/shared/Screen';
import { Card, EmptyState, ErrorState, Loader } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { listDevices } from '@/services';
import type { SensorsStackScreenProps } from '@/types/navigation';

export function SensorsScreen({ navigation }: SensorsStackScreenProps<'Sensors'>) {
  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } = useRemoteData(listDevices, [], {
    cacheKey: 'devices',
  });

  function renderContent() {
    if (loading) {
      return <Loader message="Carregando dispositivos..." />;
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
      title="Sensores"
      subtitle="Dispositivos, estado e última leitura."
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {renderContent()}
    </Screen>
  );
}
