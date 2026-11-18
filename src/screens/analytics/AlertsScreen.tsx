import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { InsightCard } from '@/components/shared/InsightCard';
import { Screen } from '@/components/shared/Screen';
import { StatTile } from '@/components/shared/StatTile';
import {
  Button,
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  Notice,
  SkeletonCards,
} from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getErrorMessage, listAlerts, markAlertAsRead } from '@/services';
import { spacing } from '@/theme';
import { ALERT_STATUS_LABELS, SEVERITY_INFO, SEVERITY_RANK, SEVERITY_SOFT } from '@/utils/severity';

type Filter = 'all' | 'unread';

export function AlertsScreen() {
  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh, mutate } =
    useRemoteData((signal) => listAlerts(undefined, signal), [], { cacheKey: 'alerts' });

  const [markingId, setMarkingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  async function markAsRead(id: string) {
    setMarkingId(id);
    setActionError(null);

    try {
      const updated = await markAlertAsRead(id);
      // Atualiza a tela na hora, com a resposta da API; depois confirma buscando a lista de novo.
      mutate((alerts) => alerts.map((alert) => (alert.id === updated.id ? updated : alert)));
      refresh();
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    } finally {
      setMarkingId(null);
    }
  }

  const unreadCount = data?.filter((alert) => alert.status === 'UNREAD').length ?? 0;
  const countBy = (severity: 'CRITICAL' | 'WARNING' | 'INFO') =>
    data?.filter((alert) => alert.severity === severity && alert.status === 'UNREAD').length ?? 0;

  const hero = data ? (
    <View style={styles.kpis}>
      {(['CRITICAL', 'WARNING', 'INFO'] as const).map((severity) => (
        <StatTile
          key={severity}
          tone="onInk"
          icon={SEVERITY_INFO[severity].icon}
          value={String(countBy(severity))}
          label={`${SEVERITY_INFO[severity].label} (não lidos)`}
          color={SEVERITY_INFO[severity].color}
          soft={SEVERITY_SOFT[severity]}
        />
      ))}
    </View>
  ) : null;

  function renderContent() {
    if (loading) {
      return <SkeletonCards count={3} />;
    }

    if (!data) {
      return (
        <ErrorState
          title="Não foi possível carregar os alertas"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    if (data.length === 0) {
      return (
        <Card>
          <EmptyState
            iconName="checkmark-circle-outline"
            title="Nenhum alerta"
            description="Quando algo merecer atenção, o aviso aparecerá aqui."
          />
        </Card>
      );
    }

    // Mais graves primeiro; dentro da mesma gravidade, os mais recentes.
    const visible = [...data]
      .filter((alert) => filter === 'all' || alert.status === 'UNREAD')
      .sort(
        (a, b) =>
          SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity] ||
          b.createdAt.localeCompare(a.createdAt),
      );

    return (
      <>
        <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />
        {actionError ? <Notice type="error" message={actionError} /> : null}

        <ChipGroup
          label="Mostrar"
          value={filter}
          variant="segmented"
          options={[
            { value: 'all', label: `Todos (${data.length})` },
            { value: 'unread', label: `Não lidos (${unreadCount})` },
          ]}
          onChange={setFilter}
        />

        {visible.length === 0 ? (
          <Card>
            <EmptyState
              iconName="checkmark-done-outline"
              title="Tudo lido"
              description="Não há alertas pendentes."
            />
          </Card>
        ) : null}

        {visible.map((alert) => (
          <InsightCard
            key={alert.id}
            severity={alert.severity}
            title={alert.title}
            message={alert.message}
            reason={alert.reason}
            basedOn={alert.basedOn}
            date={alert.createdAt}
            statusLabel={ALERT_STATUS_LABELS[alert.status]}
            footer={
              alert.status === 'UNREAD' ? (
                <Button
                  title="Marcar como lido"
                  icon="checkmark-done"
                  variant="outline"
                  onPress={() => void markAsRead(alert.id)}
                  loading={markingId === alert.id}
                  disabled={markingId !== null}
                />
              ) : null
            }
          />
        ))}
      </>
    );
  }

  return (
    <Screen
      eyebrow="Atenção"
      title="Alertas"
      subtitle="Avisos sobre as condições da plantação."
      safeTop={false}
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
