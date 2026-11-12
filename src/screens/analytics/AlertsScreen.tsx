import { useState } from 'react';

import { InsightCard } from '@/components/shared/InsightCard';
import { Screen } from '@/components/shared/Screen';
import { Button, Card, EmptyState, ErrorState, Loader, Notice } from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getErrorMessage, listAlerts, markAlertAsRead } from '@/services';
import { ALERT_STATUS_LABELS } from '@/utils/severity';

export function AlertsScreen() {
  const { data, error, loading, refreshing, reload, refresh } = useRemoteData((signal) =>
    listAlerts(undefined, signal),
  );

  const [markingId, setMarkingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function markAsRead(id: string) {
    setMarkingId(id);
    setActionError(null);

    try {
      await markAlertAsRead(id);
      refresh();
    } catch (caught) {
      setActionError(getErrorMessage(caught));
    } finally {
      setMarkingId(null);
    }
  }

  function renderContent() {
    if (loading) {
      return <Loader message="Carregando alertas..." />;
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
            title="Nenhum alerta"
            description="Quando algo merecer atenção, o aviso aparecerá aqui."
          />
        </Card>
      );
    }

    return (
      <>
        {error ? (
          <Notice type="error" message={`Não foi possível atualizar. ${error.message}`} />
        ) : null}
        {actionError ? <Notice type="error" message={actionError} /> : null}

        {data.map((alert) => (
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
      title="Alertas"
      subtitle="Avisos sobre as condições da plantação."
      safeTop={false}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {renderContent()}
    </Screen>
  );
}
