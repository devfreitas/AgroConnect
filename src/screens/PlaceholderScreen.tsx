import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, EmptyState, ErrorState, Input, Loader } from '@/components/ui';
import {  DEMO_CREDENTIALS,  aiApi,  api,  config,  normalizeError,  setAuthTokenGetter } from '@/services';
import { colors, spacing, typography } from '@/theme';
import type { Page } from '@/types/api';
import type {  AuthResponse,  Device,  LatestReadings,  Property,  Recommendation } from '@/types/domain';

export function PlaceholderScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [testingApi, setTestingApi] = useState(false);
  const [apiResult, setApiResult] = useState('Nenhum teste executado.');

  const emailError =
    email.length > 0 && !email.includes('@') ? 'Informe um e-mail válido.' : undefined;

  function simulateLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  async function testFlow() {
    setTestingApi(true);
    try {
      const login = await api.post<AuthResponse>('/auth/login', DEMO_CREDENTIALS, {
        skipAuth: true,
      });
      const token = login.data.accessToken;
      setAuthTokenGetter(() => token);

      const properties = await api.get<Page<Property>>('/properties');
      const devices = await api.get<Page<Device>>('/devices');
      const device = devices.data.items[0];

      if (!device) {
        setApiResult(`Login ok. Propriedades: ${properties.data.items.length}. Sem dispositivos.`);
        return;
      }

      const latest = await api.get<LatestReadings>(`/devices/${device.id}/readings/latest`);
      const soil = latest.data.readings.find((reading) => reading.type === 'SOIL_MOISTURE');
      const recommendations = await aiApi.post<Page<Recommendation>>('/recommendations', {
        deviceId: device.id,
      });

      setApiResult(
        [
          `Login ok: ${login.data.user.name}`,
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
      setTestingApi(false);
    }
  }

  async function testWithoutToken() {
    setTestingApi(true);
    setAuthTokenGetter(() => null);
    try {
      await api.get('/properties');
      setApiResult('Inesperado: a chamada sem token foi aceita.');
    } catch (error) {
      const apiError = normalizeError(error);
      const status = apiError.status ? ` ${apiError.status}` : '';
      setApiResult(`Sem token → [${apiError.kind}${status}] ${apiError.message}`);
    } finally {
      setTestingApi(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.lg },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>AgroConnect</Text>
      <Text style={styles.subtitle}>Vitrine de componentes (provisória)</Text>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Cliente HTTP</Text>
        <Text style={styles.body}>
          Modo: {config.useMock ? 'MOCK (dados simulados)' : 'API real'}
        </Text>
        <Text style={styles.body}>URL base: {config.apiUrl}</Text>
        <Button title="Testar fluxo completo" onPress={testFlow} loading={testingApi} />
        <Button
          title="Testar chamada sem token"
          onPress={testWithoutToken}
          variant="outline"
          disabled={testingApi}
        />
        <Text style={styles.body}>{apiResult}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Botões</Text>
        <Button title="Primário" onPress={() => {}} />
        <Button title="Secundário" onPress={() => {}} variant="secondary" />
        <Button title="Contorno" onPress={() => {}} variant="outline" />
        <Button title="Excluir" onPress={() => {}} variant="danger" />
        <Button title="Desabilitado" onPress={() => {}} disabled />
        <Button title="Simular carregamento" onPress={simulateLoading} loading={loading} />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Campos</Text>
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          error={emailError}
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          helperText="Mínimo de 8 caracteres."
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Carregando</Text>
        <Loader message="Buscando dados..." />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Estado vazio</Text>
        <EmptyState
          title="Nenhuma propriedade cadastrada"
          description="Cadastre sua primeira propriedade para começar."
          actionLabel="Cadastrar propriedade"
          onAction={() => {}}
        />
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Estado de erro</Text>
        <ErrorState onRetry={() => {}} />
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
  body: { ...typography.caption, color: colors.textMuted },
  footer: { height: spacing.lg },
});