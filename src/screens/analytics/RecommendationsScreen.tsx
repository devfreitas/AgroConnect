import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { InsightCard } from '@/components/shared/InsightCard';
import { Screen } from '@/components/shared/Screen';
import {
  Button,
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  IconBadge,
  Notice,
  SectionHeader,
  Skeleton,
  SkeletonCards,
} from '@/components/ui';
import { useElapsedSeconds } from '@/hooks/useElapsedSeconds';
import { useRemoteData } from '@/hooks/useRemoteData';
import { getErrorMessage, listDevices, requestRecommendations } from '@/services';
import { colors, radius, spacing, typography, withAlpha } from '@/theme';
import type { Recommendation } from '@/types/domain';
import { SEVERITY_RANK } from '@/utils/severity';

/** Depois de alguns segundos, explica por que demora (os serviços gratuitos hibernam). */
function getWaitingMessage(seconds: number): string {
  if (seconds < 8) {
    return 'Analisando as leituras. Isso pode levar alguns segundos...';
  }

  if (seconds < 25) {
    return 'A IA ainda está trabalhando. Na primeira análise do dia ela pode demorar mais, porque o serviço precisa acordar.';
  }

  return 'Quase lá. O serviço de IA estava dormindo e pode levar até 1 minuto. Mantenha esta tela aberta.';
}

export function RecommendationsScreen() {
  const { data: devices, error, loading, reload } = useRemoteData(listDevices);

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [results, setResults] = useState<Recommendation[] | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const waitingMessage = getWaitingMessage(useElapsedSeconds(generating));

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
      return <SkeletonCards count={2} />;
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
            iconName="hardware-chip-outline"
            title="Nenhum dispositivo encontrado"
            description="Vincule um dispositivo para receber recomendações."
          />
        </Card>
      );
    }

    const selected = devices.find((device) => device.id === deviceId) ?? devices[0];

    // Da prioridade mais alta para a mais baixa; a primeira ganha destaque.
    const ordered = results
      ? [...results].sort((a, b) => SEVERITY_RANK[b.priority] - SEVERITY_RANK[a.priority])
      : null;

    return (
      <>
        {devices.length > 1 ? (
          <ChipGroup
            label="Dispositivo"
            value={selected.id}
            options={devices.map((device) => ({
              value: device.id,
              label: device.name,
              icon: 'hardware-chip-outline' as const,
            }))}
            onChange={(value) => {
              setDeviceId(value);
              setResults(null);
              setGenerateError(null);
            }}
          />
        ) : null}

        <Card variant="dark" style={styles.generate}>
          <View style={styles.generateHeader}>
            <IconBadge icon="sparkles" size={48} color={colors.ink} background={colors.accent} />
            <View style={styles.generateText}>
              <Text style={styles.generateTitle}>Análise de {selected.name}</Text>
              <Text style={styles.generateSub}>
                Gere sugestões informativas a partir das leituras e alertas registrados.
              </Text>
            </View>
          </View>
          <Button
            title={results ? 'Gerar novamente' : 'Gerar recomendações'}
            icon="sparkles-outline"
            onPress={() => void generate(selected.id)}
            loading={generating}
            accessibilityHint="Pede uma análise ao servidor. Pode levar alguns segundos."
          />
        </Card>

        {generating ? (
          <View
            style={styles.generating}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={waitingMessage}
          >
            <Skeleton height={14} width="55%" />
            <Skeleton height={12} width="90%" />
            <Skeleton height={12} width="75%" />
            <Text style={styles.generatingText}>{waitingMessage}</Text>
          </View>
        ) : null}
        {generateError ? <Notice type="error" message={generateError} /> : null}

        {!generating && ordered && ordered.length === 0 ? (
          <Card>
            <EmptyState
              iconName="checkmark-circle-outline"
              title="Nenhuma recomendação no momento"
              description="A IA analisa os alertas ativos do dispositivo que tenham leituras válidas. Este dispositivo não tem nenhum no momento."
            />
          </Card>
        ) : null}

        {!generating && ordered && ordered.length > 0 ? (
          <>
            <SectionHeader
              title={ordered.length === 1 ? '1 recomendação' : `${ordered.length} recomendações`}
            />
            {ordered.map((item, index) => (
              <InsightCard
                key={item.id}
                severity={item.priority}
                title={item.title}
                message={item.message}
                reason={item.reason}
                basedOn={item.basedOn}
                date={item.generatedAt}
                disclaimer={item.disclaimer}
                emphasis={index === 0}
              />
            ))}
          </>
        ) : null}
      </>
    );
  }

  return (
    <Screen
      eyebrow="Inteligência"
      title="Recomendações"
      subtitle="Sugestões informativas a partir das leituras. Nenhuma aciona equipamentos."
      safeTop={false}
    >
      {renderContent()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  generate: { gap: spacing.md },
  generateHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  generateText: { flex: 1, gap: 2 },
  generateTitle: { ...typography.subheading, color: colors.onInk },
  generateSub: { ...typography.caption, lineHeight: 19, color: colors.onInkMuted },
  generating: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(colors.primary, 0.3),
    backgroundColor: colors.surface,
  },
  generatingText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.xs },
});
