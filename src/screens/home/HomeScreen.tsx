import { Card, EmptyState } from '@/components/ui';
import { Screen } from '@/components/shared/Screen';

export function HomeScreen() {
  return (
    <Screen title="Início" subtitle="Resumo das condições da sua plantação.">
      <Card>
        <EmptyState
          title="Nenhuma leitura para exibir"
          description="As condições atuais e os alertas aparecerão aqui."
        />
      </Card>
    </Screen>
  );
}
