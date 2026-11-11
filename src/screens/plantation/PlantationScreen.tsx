import { useCallback } from 'react';

import { PropertyCard } from '@/components/shared/PropertyCard';
import { Screen } from '@/components/shared/Screen';
import { Button, EmptyState, ErrorState, Loader, Notice } from '@/components/ui';
import { useAutoDismiss } from '@/hooks/useAutoDismiss';
import { useRemoteData } from '@/hooks/useRemoteData';
import { listProperties } from '@/services';
import type { PlantationStackScreenProps } from '@/types/navigation';

export function PlantationScreen({ navigation, route }: PlantationStackScreenProps<'Plantation'>) {
  const { data, error, loading, refreshing, reload, refresh } = useRemoteData(listProperties);

  const notice = route.params?.notice;
  const dismissNotice = useCallback(() => navigation.setParams({ notice: undefined }), [navigation]);
  useAutoDismiss(notice, dismissNotice);

  const openForm = () => navigation.navigate('PropertyForm');

  function renderContent() {
    if (loading) {
      return <Loader message="Carregando propriedades..." />;
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
        {error ? <Notice type="error" message={`Não foi possível atualizar. ${error.message}`} /> : null}

        {data.length === 0 ? (
          <EmptyState
            title="Nenhuma propriedade cadastrada"
            description="Cadastre sua primeira propriedade para começar."
            actionLabel="Cadastrar propriedade"
            onAction={openForm}
          />
        ) : (
          <>
            <Button title="Nova propriedade" onPress={openForm} />
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
      title="Plantação"
      subtitle="Propriedades, talhões e plantios."
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {notice ? <Notice type="success" message={notice} /> : null}
      {renderContent()}
    </Screen>
  );
}
