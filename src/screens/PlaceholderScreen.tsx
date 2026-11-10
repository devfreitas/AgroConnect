import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { aiApi, api, config, normalizeError } from '@/services';
import { notifyUnauthorized } from '@/services/authBridge';
import { colors, spacing, typography } from '@/theme';
import type { Page } from '@/types/api';
import type { Device, LatestReadings, Property, Recommendation } from '@/types/domain';

export function PlaceholderScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [testing, setTesting] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [apiResult, setApiResult] = useState('Nenhum teste executado.');

  async function testApi() {
    setTesting(true);
    try {
      const properties = await api.get<Page<Property>>('/properties');
      const devices = await api.get<Page<Device>>('/devices');
      const device = devices.data.items[0];

      if (!device) {
        setApiResult(
          `Propriedades: ${properties.data.items.length}. Esta conta ainda não tem dispositivos.`,
        );
        return;
      }

      const latest = await api.get<LatestReadings>(`/devices/${device.id}/readings/latest`);
      const soil = latest.data.readings.find((reading) => reading.type === 'SOIL_MOISTURE');
      const recommendations = await aiApi.post<Page<Recommendation>>('/recommendations', {
        deviceId: device.id,
      });

      setApiResult(
        [
          `Propriedades: ${properties.data.items.length}`,
          `Dispositivos: ${devices.data.items.length} (${device.code}: ${device.status})`,
          `Umidade do solo: ${soil?.value ?? '—'}${soil?.unit ?? ''} [${soil?.quality ?? '—'}]`,
          `IA: ${recommendations.data.items[0]?.title ?? 'sem recomendação'}`,
        ].join('\n'),
      );
    } catch (error) {
      const apiError = normalizeError(error);
      const status = apiError.status ? ` ${apiError.status}` : '';
      setApiResult(`Erro [${apiError.kind}${status}]: ${apiError.message}`);
    } finally {
      setTesting(false);
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
      ]}
    >
      <Text style={styles.title}>AgroConnect</Text>
      <Text style={styles.subtitle}>Tela provisória (área logada)</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sessão</Text>
        <Text style={styles.bodyStrong}>{user?.name ?? '—'}</Text>
        <Text style={styles.body}>{user?.email ?? '—'}</Text>
        <Button title="Sair" onPress={handleSignOut} variant="outline" loading={signingOut} />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>API autenticada</Text>
        <Text style={styles.body}>API: {config.apiUrl}</Text>
        <Button title="Testar API autenticada" onPress={testApi} loading={testing} />
        <Text style={styles.body}>{apiResult}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Teste de sessão expirada</Text>
        <Text style={styles.body}>
          Simula uma resposta 401 da API: a sessão deve terminar e o login deve avisar.
        </Text>
        <Button
          title="Simular sessão expirada"
          onPress={notifyUnauthorized}
          variant="danger"
          disabled={testing || signingOut}
        />
      </Card>

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  title: { ...typography.display, color: colors.primary },
  subtitle: { ...typography.body, color: colors.text },
  section: { gap: spacing.sm },
  sectionTitle: { ...typography.subheading, color: colors.text },
  bodyStrong: { ...typography.bodyStrong, color: colors.text },
  body: { ...typography.caption, color: colors.textMuted },
  footer: { height: spacing.lg },
});