import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/services';
import { colors, spacing, typography } from '@/theme';

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn, sessionMessage, clearSessionMessage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    clearSessionMessage();

    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await signIn({ email: email.trim(), password });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>AgroConnect</Text>
        <Text style={styles.subtitle}>Entre para acompanhar a sua plantação.</Text>
      </View>

      {sessionMessage ? (
        <Card accessibilityRole="alert">
          <Text style={styles.notice}>{sessionMessage}</Text>
        </Card>
      ) : null}

      <Card style={styles.form}>
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Sua senha"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
        />

        {error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : null}

        <Button title="Entrar" onPress={handleSubmit} loading={loading} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.md, gap: spacing.md },
  header: { gap: spacing.xs, marginBottom: spacing.sm },
  title: { ...typography.display, color: colors.primary },
  subtitle: { ...typography.body, color: colors.text },
  notice: { ...typography.bodyStrong, color: colors.text },
  form: { gap: spacing.md },
  error: { ...typography.caption, color: colors.error },
});