import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DataStatus } from '@/components/shared/DataStatus';
import { PropertyCard } from '@/components/shared/PropertyCard';
import { ReadingCard } from '@/components/shared/ReadingCard';
import { Screen } from '@/components/shared/Screen';
import { SignalBars } from '@/components/shared/SignalBars';
import { StatTile } from '@/components/shared/StatTile';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Card,
  ChipGroup,
  EmptyState,
  ErrorState,
  IconBadge,
  Notice,
  SectionHeader,
  SkeletonCards,
} from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useRemoteData } from '@/hooks/useRemoteData';
import { navigateToAlerts, openProperty, openTab } from '@/navigation/navigationRef';
import {
  getHistory,
  getLatestReadings,
  listAlerts,
  listDevices,
  listProperties,
  listSensors,
} from '@/services';
import { colors, radius, spacing, typography } from '@/theme';
import type { Alert, Device, LatestReadings, Property } from '@/types/domain';
import { firstName, formatDateTime, greeting } from '@/utils/format';
import { buildRange } from '@/utils/period';
import { READING_ORDER } from '@/utils/readings';
import { SEVERITY_INFO, SEVERITY_RANK, SEVERITY_SOFT } from '@/utils/severity';

type Overview = {
  devices: Device[];
  selected: Device | null;
  latest: LatestReadings | null;
  /** Tendência das últimas 24 horas por sensor. Ausente se o histórico não carregou. */
  trends: Record<string, (number | null)[]>;
  /** Alertas e propriedades complementam o painel; se falharem, o painel segue sem eles. */
  alerts: Alert[] | null;
  properties: Property[] | null;
};

/** Resultado opcional: uma falha aqui não derruba o painel. */
function optional<T>(promise: Promise<T>): Promise<T | null> {
  return promise.catch(() => null);
}

export function HomeScreen() {
  const { user } = useAuth();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, error, loading, refreshing, updatedAt, fromCache, reload, refresh } =
    useRemoteData<Overview>(
      async (signal) => {
        const devices = await listDevices(signal);
        const selected = devices.find((device) => device.id === selectedId) ?? devices[0] ?? null;

        const [latest, trends, alerts, properties] = await Promise.all([
          selected ? getLatestReadings(selected.id, signal) : Promise.resolve(null),
          selected ? loadTrends(selected.id, signal) : Promise.resolve({}),
          optional(listAlerts(undefined, signal)),
          optional(listProperties(signal)),
        ]);

        return { devices, selected, latest, trends, alerts, properties };
      },
      [selectedId],
      { cacheKey: `home2:${selectedId}` },
    );

  const unread = data?.alerts?.filter((alert) => alert.status === 'UNREAD') ?? [];
  const onlineCount = data?.devices.filter((device) => device.status === 'ONLINE').length ?? 0;
  const totalHectares = data?.properties?.reduce((sum, item) => sum + item.areaHectares, 0) ?? 0;

  const hero = data ? (
    <View style={styles.kpis}>
      <StatTile
        tone="onInk"
        icon="hardware-chip-outline"
        value={`${onlineCount}/${data.devices.length}`}
        label="Dispositivos online"
        onPress={() => openTab('SensorsTab')}
        accessibilityHint="Abre a lista de sensores"
      />
      <StatTile
        tone="onInk"
        icon="notifications-outline"
        value={data.alerts ? String(unread.length) : '—'}
        label="Alertas não lidos"
        onPress={() => navigateToAlerts()}
        accessibilityHint="Abre a lista de alertas"
      />
      <StatTile
        tone="onInk"
        icon="leaf-outline"
        value={
          data.properties
            ? totalHectares.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
            : '—'
        }
        label="Hectares cadastrados"
        onPress={() => openTab('PlantationTab')}
        accessibilityHint="Abre as propriedades"
      />
    </View>
  ) : null;

  function renderContent() {
    if (loading) {
      return <SkeletonCards count={3} />;
    }

    if (!data) {
      return (
        <ErrorState
          title="Não foi possível carregar o painel"
          message={error?.message}
          onRetry={reload}
        />
      );
    }

    const { devices, selected, latest, trends, properties } = data;

    if (!selected) {
      return (
        <Card>
          <EmptyState
            iconName="hardware-chip-outline"
            title="Nenhum dispositivo cadastrado"
            description="Quando houver um dispositivo vinculado à sua conta, as leituras aparecerão aqui."
          />
        </Card>
      );
    }

    const readings = READING_ORDER.map((type) =>
      latest?.readings.find((reading) => reading.type === type),
    ).filter((reading) => reading !== undefined);

    const topUnread = [...unread].sort(
      (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity],
    )[0];

    return (
      <>
        <DataStatus error={error} updatedAt={updatedAt} fromCache={fromCache} />

        {data.alerts ? (
          topUnread ? (
            <Pressable
              onPress={() => navigateToAlerts()}
              accessibilityRole="button"
              accessibilityLabel={`${SEVERITY_INFO[topUnread.severity].label}: ${topUnread.title}. ${unread.length} ${unread.length === 1 ? 'alerta não lido' : 'alertas não lidos'}.`}
              accessibilityHint="Abre a lista de alertas"
              style={({ pressed }) => [
                styles.banner,
                { backgroundColor: SEVERITY_SOFT[topUnread.severity] },
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.bannerBar,
                  { backgroundColor: SEVERITY_INFO[topUnread.severity].color },
                ]}
              />
              <IconBadge
                icon={SEVERITY_INFO[topUnread.severity].icon}
                color={SEVERITY_INFO[topUnread.severity].color}
                background={colors.surface}
                size={44}
              />
              <View style={styles.bannerText}>
                <Text
                  style={[styles.bannerKicker, { color: SEVERITY_INFO[topUnread.severity].color }]}
                >
                  {SEVERITY_INFO[topUnread.severity].label} ·{' '}
                  {unread.length === 1 ? '1 alerta não lido' : `${unread.length} alertas não lidos`}
                </Text>
                <Text style={styles.bannerTitle} numberOfLines={2}>
                  {topUnread.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </Pressable>
          ) : (
            <View
              style={styles.allClear}
              accessible
              accessibilityLabel="Tudo em ordem. Nenhum alerta não lido."
            >
              <IconBadge
                icon="checkmark-circle"
                color={colors.success}
                background={colors.surface}
                size={44}
              />
              <View style={styles.bannerText}>
                <Text style={[styles.bannerKicker, { color: colors.success }]}>Tudo em ordem</Text>
                <Text style={styles.bannerTitle}>Nenhum alerta não lido no momento.</Text>
              </View>
            </View>
          )
        ) : null}

        {latest?.simulatedData ? (
          <Notice
            type="info"
            message="Dados simulados: as leituras abaixo são fictícias, para demonstração."
          />
        ) : null}

        {devices.length > 1 ? (
          <ChipGroup
            label="Dispositivo"
            value={selected.id}
            options={devices.map((device) => ({
              value: device.id,
              label: device.name,
              icon: 'hardware-chip-outline' as const,
            }))}
            onChange={setSelectedId}
          />
        ) : null}

        <Card variant="tinted" style={styles.device}>
          <IconBadge icon="hardware-chip" size={44} background={colors.surface} />
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName} numberOfLines={2}>
              {selected.name}
            </Text>
            <Text style={styles.deviceSeen}>
              {selected.lastSeenAt
                ? `Visto em ${formatDateTime(selected.lastSeenAt)}`
                : 'Sem contato registrado'}
            </Text>
          </View>
          <View style={styles.deviceStatus}>
            <StatusBadge status={selected.status} />
            <SignalBars rssi={selected.rssi} />
          </View>
        </Card>

        <SectionHeader
          title="Leituras agora"
          actionLabel="Ver sensores"
          onAction={() => openTab('SensorsTab')}
        />

        {readings.length === 0 ? (
          <Card>
            <EmptyState
              iconName="analytics-outline"
              title="Nenhuma leitura disponível"
              description="Este dispositivo ainda não enviou leituras."
            />
          </Card>
        ) : (
          <View style={styles.grid}>
            {readings.map((reading) => (
              <View key={reading.sensorId} style={styles.cell}>
                <ReadingCard reading={reading} layout="tile" trend={trends[reading.sensorId]} />
              </View>
            ))}
          </View>
        )}

        {properties && properties.length > 0 ? (
          <>
            <SectionHeader
              title="Suas propriedades"
              actionLabel="Ver todas"
              onAction={() => openTab('PlantationTab')}
            />
            {properties.slice(0, 2).map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onPress={() => openProperty(property.id)}
              />
            ))}
          </>
        ) : null}
      </>
    );
  }

  const name = firstName(user?.name);

  return (
    <Screen
      eyebrow={name ? `${greeting()}, ${name}` : greeting()}
      title="Sua plantação"
      subtitle="Condições, alertas e propriedades em um só lugar."
      hero={hero}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      {renderContent()}
    </Screen>
  );
}

/** Últimas 24 horas de cada sensor, para os mini gráficos. Se falhar, os cartões saem sem tendência. */
async function loadTrends(
  deviceId: string,
  signal: AbortSignal,
): Promise<Record<string, (number | null)[]>> {
  try {
    const sensors = await listSensors(deviceId, signal);
    const range = buildRange('24h');
    const histories = await Promise.all(
      sensors.map((sensor) =>
        optional(getHistory(deviceId, { sensorId: sensor.id, ...range }, signal)),
      ),
    );

    const trends: Record<string, (number | null)[]> = {};
    sensors.forEach((sensor, index) => {
      const history = histories[index];
      if (history) trends[sensor.id] = history.items.map((item) => item.value);
    });
    return trends;
  } catch {
    return {};
  }
}

const styles = StyleSheet.create({
  kpis: { flexDirection: 'row', gap: spacing.sm },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md + 4,
    paddingRight: spacing.md,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  bannerBar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  allClear: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.successSoft,
  },
  pressed: { opacity: 0.9 },
  bannerText: { flex: 1, gap: 2 },
  bannerKicker: { ...typography.overline },
  bannerTitle: { ...typography.bodyStrong, color: colors.text },
  device: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deviceInfo: { flex: 1, gap: 2 },
  deviceName: { ...typography.bodyStrong, color: colors.text },
  deviceSeen: { ...typography.caption, fontSize: 12, lineHeight: 17, color: colors.textMuted },
  deviceStatus: { alignItems: 'flex-end', gap: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm + 2 },
  cell: { width: '48%', flexGrow: 1 },
});
