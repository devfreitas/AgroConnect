import { Card, EmptyState } from '@/components/ui';
import { Screen } from '@/components/shared/Screen';

export function PlantationScreen() {
  return (
    <Screen title="Plantação" subtitle="Propriedades, talhões e plantios.">
      <Card>
        <EmptyState
          title="Nenhuma propriedade cadastrada"
          description="Suas propriedades e plantações aparecerão aqui."
        />
      </Card>
    </Screen>
  );
}
