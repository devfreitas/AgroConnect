import { useState } from 'react';

import { InsightCard } from '@/components/shared/InsightCard';
import { Screen } from '@/components/shared/Screen';
import {
  Button,
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  Loader,
  Notice,
} from '@/components/ui';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getErrorMessage, listDevices, requestRecommendations } from '@/services';
import type { Recommendation } from '@/types/domain';

export function RecommendationsScreen() {
  const { data: devices, error, loading, reload } = useRemoteData(listDevices);

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  async function generate(id: string) {
    setGenerating(true);
    setGenerateError(null);

    try {
      setResults(await requestRecommendations(id));
    } catch (caught) {
      setGenerateError(getErrorMessage(caught));
    } finally {
      setGenerating(false);
    }
  }

  function renderContent() {
    if (loading) {
      return <Loader message="Carregando dispositivos..." />;
    }

    if (!devices) {
      return (
        <ErrorState
          title="Não foi possível carregar os dispositivos"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    if (devices.length === 0) {
      return (
        <Card>
          <EmptyState
            title="Nenhum dispositivo encontrado"
            description="Vincule um dispositivo para receber recomendações."
          />
        </Card>
      );
    }

    const selected = devices.find((device) => device.id === deviceId) ?? devices[0];

    return (
      <>
        {devices.length > 1 ? (
          <ChipGroup
            label="Dispositivo"
            value={selected.id}
            options={devices.map((device) => ({ value: device.id, label: device.name }))}
            onChange={(value) => {
              setDeviceId(value);
              setResults(null);
              setGenerateError(null);
            }}
          />
        ) : null}

        <Button
          title="Gerar recomendações"
          onPress={() => void generate(selected.id)}
          loading={generating}
          accessibilityHint="Pede uma análise à inteligência artificial. Pode levar alguns segundos."
        />

        {generating ? <Loader message="Analisando as leituras. Isso pode levar alguns segundos..." /> : null}
        {generateError ? <Notice type="error" message={generateError} /> : null}

        {!generating && results && results.length === 0 ? (
          <Card>
            <EmptyState
              title="Nenhuma recomendação no momento"
              description="As condições atuais não pedem nenhuma atenção especial."
            />
          </Card>
        ) : null}

        {!generating
          ? results?.map((item) => (
              <InsightCard
                key={item.id}
                severity={item.priority}
                title={item.title}
                message={item.message}
                reason={item.reason}
                basedOn={item.basedOn}
                date={item.generatedAt}
                disclaimer={item.disclaimer}
              />
            ))
          : null}
      </>
    );
  }

  return (
    <Screen
      title="Recomendações"
      subtitle="Sugestões informativas geradas por IA a partir das leituras."
      safeTop={false}
    >
      {renderContent()}
    </Screen>
  );
}
