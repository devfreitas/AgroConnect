import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { Screen } from '@/components/shared/Screen';
import { Button, Card, ErrorState, Loader, Notice } from '@/components/ui';
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

  const dismissNotice = useCallback(() => navigation.setParams({ notice: undefined }), [navigation]);
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
        <Loader message="Carregando propriedade..." />
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
      title={data.name}
      subtitle={`${data.city}, ${data.state}`}
      safeTop={false}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {notice ? <Notice type="success" message={notice} /> : null}
      <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />

      <Card style={styles.card}>
        <Text style={styles.label}>Área</Text>
        <Text style={styles.value}>{formatHectares(data.areaHectares)}</Text>

        <Text style={styles.label}>Descrição</Text>
        <Text style={styles.value}>{data.description ?? 'Sem descrição.'}</Text>

        <Text style={styles.label}>Cadastrada em</Text>
        <Text style={styles.value}>{formatDate(data.createdAt)}</Text>

        <Text style={styles.label}>Atualizada em</Text>
        <Text style={styles.value}>{formatDate(data.updatedAt)}</Text>
      </Card>

      {deleteError ? <Notice type="error" message={deleteError} /> : null}

      <Button
        title="Editar propriedade"
        onPress={() => navigation.navigate('PropertyForm', { propertyId })}
        variant="outline"
        disabled={deleting}
      />
      <Button
        title="Excluir propriedade"
        onPress={confirmDelete}
        variant="danger"
        loading={deleting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  value: { ...typography.bodyStrong, color: colors.text },
});
