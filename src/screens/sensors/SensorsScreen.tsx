import { Card, EmptyState } from '@/components/ui';
import { Screen } from '@/components/shared/Screen';

export function SensorsScreen() {
  return (
    <Screen title="Sensores" subtitle="Dispositivos, estado e última leitura.">
      <Card>
        <EmptyState
          title="Nenhum dispositivo encontrado"
          description="Os dispositivos e sensores vinculados aparecerão aqui."
        />
      </Card>
    </Screen>
  );
}
