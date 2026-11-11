import { Card, EmptyState } from '@/components/ui';
import { Screen } from '@/components/shared/Screen';

export function AnalyticsScreen() {
  return (
    <Screen title="Análises" subtitle="Histórico, gráficos e recomendações.">
      <Card>
        <EmptyState
          title="Sem dados para analisar"
          description="O histórico das leituras e as recomendações aparecerão aqui."
        />
      </Card>
    </Screen>
  );
}
