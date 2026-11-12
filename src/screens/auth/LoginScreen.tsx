import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AuthLayout } from '@/components/shared/AuthLayout';
import { Button, Card, Input, Notice, TextLink } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { config } from '@/services';
import { colors, spacing, typography } from '@/theme';
import type { AuthStackScreenProps } from '@/types/navigation';
import { applyServerErrors } from '@/utils/formErrors';

import { loginSchema, type LoginFormValues } from './schemas';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { signIn, sessionMessage, clearSessionMessage } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    clearSessionMessage();
    setFormError(null);

    try {
      await signIn(values);
    } catch (error) {
      setFormError(applyServerErrors(error, setError, ['email', 'password']));
    }
  });

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para acompanhar a plantação.">
      {!config.isConfigured ? (
        <Notice
          type="error"
          message="Este build não tem as URLs das APIs. Gere o app com EXPO_PUBLIC_API_URL e EXPO_PUBLIC_AI_API_URL definidas."
        />
      ) : null}

      {sessionMessage ? (
        <Card accessibilityRole="alert">
          <Text style={styles.notice}>{sessionMessage}</Text>
        </Card>
      ) : null}

      <Card style={styles.form}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="E-mail"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              placeholder="voce@exemplo.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              placeholder="Sua senha"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={() => void onSubmit()}
            />
          )}
        />

        {formError ? (
          <Text style={styles.error} accessibilityRole="alert">
            {formError}
          </Text>
        ) : null}

        <Button title="Entrar" onPress={onSubmit} loading={isSubmitting} />
      </Card>

      <TextLink
        prefix="Não tem conta?"
        label="Criar conta"
        onPress={() => navigation.navigate('Register')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  notice: { ...typography.bodyStrong, color: colors.text },
  error: { ...typography.caption, color: colors.error },
});
