import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { Screen } from '@/components/shared/Screen';
import { StatTile } from '@/components/shared/StatTile';
import { Button, EmptyState, ErrorState, Notice, SkeletonCards } from '@/components/ui';
import { useAutoDismiss } from '@/hooks/useAutoDismiss';
import { useRemoteData } from '@/hooks/useRemoteData';
import { listProperties } from '@/services';
import { spacing } from '@/theme';
import type { PlantationStackScreenProps } from '@/types/navigation';
import { formatHectares } from '@/utils/format';

export function PlantationScreen({ navigation, route }: PlantationStackScreenProps<'Plantation'>) {
  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } = useRemoteData(
    listProperties,
    [],
    {
      cacheKey: 'properties',
    },
  );

  const notice = route.params?.notice;
  const dismissNotice = useCallback(
    () => navigation.setParams({ notice: undefined }),
    [navigation],
  );
  useAutoDismiss(notice, dismissNotice);

  const openForm = () => navigation.navigate('PropertyForm');

  const totalHectares = data?.reduce((sum, property) => sum + property.areaHectares, 0) ?? 0;

  const hero = data ? (
    <View style={styles.kpis}>
      <StatTile
        tone="onInk"
        icon="leaf-outline"
        value={String(data.length)}
        label={data.length === 1 ? 'Propriedade' : 'Propriedades'}
      />
      <StatTile
        tone="onInk"
        icon="resize-outline"
        value={formatHectares(totalHectares)}
        label="Área total monitorada"
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
          title="Não foi possível carregar as propriedades"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    return (
      <>
        <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />

        {data.length === 0 ? (
          <EmptyState
            iconName="leaf-outline"
            title="Nenhuma propriedade cadastrada"
            description="Cadastre sua primeira propriedade para começar."
            actionLabel="Cadastrar propriedade"
            onAction={openForm}
          />
        ) : (
          <>
            <Button title="Nova propriedade" icon="add-circle-outline" onPress={openForm} />
            {data.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onPress={() => navigation.navigate('PropertyDetail', { propertyId: property.id })}
              />
            ))}
          </>
        )}
      </>
    );
  }

  return (
    <Screen
      eyebrow="Monitoramento"
      title="Plantação"
      subtitle="Propriedades, talhões e plantios."
      hero={hero}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {notice ? <Notice type="success" message={notice} /> : null}
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: spacing.sm },
});
