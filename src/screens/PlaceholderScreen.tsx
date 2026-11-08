import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Card, EmptyState, ErrorState, Input, Loader } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';

export function PlaceholderScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailError = email.length > 0 && !email.includes('@') ? 'Informe um e-mail válido.' : undefined;

  function simulateLoading() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
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
  footer: { height: spacing.lg },
});