import type { ReactNode } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '@/theme';

import { BrandMark } from './BrandMark';
import { FadeIn } from './FadeIn';
import { FieldBackdrop } from './FieldBackdrop';

type AuthLayoutProps = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
};

/** Estrutura das telas de acesso: fundo claro, logo centralizada, título e formulário. */
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.flex} behavior="padding">
      <FieldBackdrop />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeIn style={styles.brand}>
          <BrandMark size={72} />
          <Text style={styles.brandName} accessibilityRole="header">
            AgroConnect
          </Text>
          <Text style={styles.tagline}>Inteligência agrícola para a sua propriedade</Text>
        </FadeIn>

        {title || subtitle ? (
          <FadeIn delay={140} style={styles.header}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </FadeIn>
        ) : null}

        <FadeIn delay={280} style={styles.form}>
          {children}
        </FadeIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  scrollView: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xl,
  },
  brand: { alignItems: 'center', gap: spacing.xs },
  brandName: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  tagline: { ...typography.caption, color: colors.textMuted, textAlign: 'center' },
  header: { alignItems: 'center', gap: spacing.xs },
  title: { ...typography.heading, color: colors.text },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  form: { gap: spacing.md },
});
