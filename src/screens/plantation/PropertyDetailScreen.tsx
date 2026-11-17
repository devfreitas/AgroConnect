import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { InfoRow } from '@/components/shared/InfoRow';
import { Screen } from '@/components/shared/Screen';
import { StatTile } from '@/components/shared/StatTile';
import { Button, Card, ErrorState, Notice, SkeletonCards } from '@/components/ui';
import { useAutoDismiss } from '@/hooks/useAutoDismiss';
import { useRemoteData } from '@/hooks/useRemoteData';
import { deleteProperty, getErrorMessage, getProperty } from '@/services';
import { colors, spacing, typography } from '@/theme';
import type { PlantationStackScreenProps } from '@/types/navigation';
import { formatDate, formatHectares } from '@/utils/format';

export function PropertyDetailScreen({
  navigation,
  route,
}: PlantationStackScreenProps<'PropertyDetail'>) {
  const { propertyId, notice } = route.params;
  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } = useRemoteData(
    (signal) => getProperty(propertyId, signal),
    [propertyId],
    { cacheKey: `property:${propertyId}` },
  );

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const dismissNotice = useCallback(
    () => navigation.setParams({ notice: undefined }),
    [navigation],
  );
  useAutoDismiss(notice, dismissNotice);

  function confirmDelete() {
    Alert.alert(
      'Excluir propriedade',
      `Deseja excluir "${data?.name ?? 'esta propriedade'}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => void runDelete() },
      ],
    );
  }

  async function runDelete() {
    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteProperty(propertyId);
      navigation.popTo('Plantation', { notice: 'Propriedade excluída com sucesso.' });
    } catch (e) {
      setDeleteError(getErrorMessage(e));
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <Screen title="Propriedade" safeTop={false}>
        <SkeletonCards count={2} />
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen title="Propriedade" safeTop={false}>
        <ErrorState
          title="Não foi possível carregar a propriedade"
          message={error?.message}
          onRetry={reload}
        />
      </Screen>
    );
  }

  return (
    <Screen
      eyebrow="Propriedade"
      title={data.name}
      subtitle={`${data.city}, ${data.state}`}
      safeTop={false}
      onRefresh={refresh}
      refreshing={refreshing}
      hero={
        <View style={styles.kpis}>
          <StatTile
            tone="onInk"
            icon="resize-outline"
            value={formatHectares(data.areaHectares)}
            label="Área"
          />
          <StatTile tone="onInk" icon="location-outline" value={data.state} label={data.city} />
        </View>
      }
    >
      {notice ? <Notice type="success" message={notice} /> : null}
      <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />

      <Card style={styles.card}>
        <Text style={styles.heading}>Sobre a propriedade</Text>
        <Text style={styles.description}>{data.description ?? 'Sem descrição.'}</Text>
      </Card>

      <Card style={styles.card}>
        <InfoRow icon="calendar-outline" label="Cadastrada em" value={formatDate(data.createdAt)} />
        <View style={styles.divider} />
        <InfoRow icon="refresh-outline" label="Atualizada em" value={formatDate(data.updatedAt)} />
      </Card>

      {deleteError ? <Notice type="error" message={deleteError} /> : null}

      <Button
        title="Editar propriedade"
        icon="create-outline"
        onPress={() => navigation.navigate('PropertyForm', { propertyId })}
        variant="outline"
        disabled={deleting}
      />
      <Button
        title="Excluir propriedade"
        icon="trash-outline"
        onPress={confirmDelete}
        variant="danger"
        loading={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: spacing.sm },
  card: { gap: spacing.xs },
  heading: { ...typography.subheading, color: colors.text },
  description: { ...typography.body, color: colors.text },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 56 },
});
