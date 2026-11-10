import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { AuthLayout } from '@/components/shared/AuthLayout';
import { Button, Card, Input, TextLink } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { colors, spacing, typography } from '@/theme';
import type { AuthStackScreenProps } from '@/types/navigation';
import { applyServerErrors } from '@/utils/formErrors';

import { registerSchema, type RegisterFormValues } from './schemas';

export function RegisterScreen({ navigation }: AuthStackScreenProps<'Register'>) {
  const { signUp } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await signUp({ name: values.name, email: values.email, password: values.password });
    } catch (error) {
      setFormError(applyServerErrors(error, setError, ['name', 'email', 'password']));
    }
  });

  return (
    <AuthLayout title="Criar conta" subtitle="Cadastre-se para monitorar a sua plantação.">
      <Card style={styles.form}>
        <Controller
          control={control}
          name="name"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Nome"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              placeholder="Seu nome"
              autoCapitalize="words"
              autoComplete="name"
            />
          )}
        />

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
              helperText="Mínimo de 8 caracteres."
              placeholder="Crie uma senha"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
            />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Confirmar senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.confirmPassword?.message}
              placeholder="Repita a senha"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
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

        <Button title="Criar conta" onPress={onSubmit} loading={isSubmitting} />
      </Card>

      <TextLink
        prefix="Já tem conta?"
        label="Entrar"
        onPress={() => navigation.navigate('Login')}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  error: { ...typography.caption, color: colors.error },
});
