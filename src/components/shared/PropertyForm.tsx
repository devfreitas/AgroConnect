import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import { Button, Card, Input } from '@/components/ui';
import { propertySchema, type PropertyFormValues } from '@/screens/plantation/schemas';
import { colors, spacing, typography } from '@/theme';
import { applyServerErrors } from '@/utils/formErrors';

type PropertyFormProps = {
  initialValues: PropertyFormValues;
  submitLabel: string;
  /** Deve lançar o erro da API se o envio falhar. */
  onSubmit: (values: PropertyFormValues) => Promise<void>;
};

const SERVER_FIELDS = ['name', 'city', 'state', 'areaHectares', 'description'] as const;

export function PropertyForm({ initialValues, submitLabel, onSubmit }: PropertyFormProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: initialValues,
    mode: 'onTouched',
  });

  const submit = handleSubmit(async (values) => {
    setFormError(null);

    try {
      await onSubmit(values);
    } catch (error) {
      setFormError(applyServerErrors(error, setError, SERVER_FIELDS));
    }
  });

  return (
    <Card style={styles.form}>
      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Nome da propriedade"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            placeholder="Ex.: Sítio Boa Esperança"
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="city"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Cidade"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.city?.message}
            placeholder="Ex.: Ibiúna"
            autoCapitalize="words"
          />
        )}
      />

      <Controller
        control={control}
        name="state"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Estado (UF)"
            value={value}
            onChangeText={(text) => onChange(text.toUpperCase())}
            onBlur={onBlur}
            error={errors.state?.message}
            placeholder="Ex.: SP"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={2}
          />
        )}
      />

      <Controller
        control={control}
        name="areaHectares"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Área (hectares)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.areaHectares?.message}
            helperText="Use vírgula ou ponto para decimais."
            placeholder="Ex.: 3,5"
            keyboardType="decimal-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Descrição (opcional)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.description?.message}
            placeholder="Ex.: Hortaliças e horta de consumo próprio"
            multiline
          />
        )}
      />

      {formError ? (
        <Text style={styles.error} accessibilityRole="alert">
          {formError}
        </Text>
      ) : null}

      <Button title={submitLabel} onPress={submit} loading={isSubmitting} />
    </Card>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  error: { ...typography.caption, color: colors.error },
});
