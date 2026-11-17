import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing, typography } from '@/theme';

import { BrandPattern } from './BrandPattern';

type ScreenProps = {
  title: string;
  subtitle?: string;
  /** Linha pequena acima do título (ex.: a saudação). */
  eyebrow?: string;
  children?: ReactNode;
  /** Conteúdo extra dentro do cabeçalho escuro, abaixo do título (indicadores, ações). */
  hero?: ReactNode;
  /** Soma a área segura superior. Use false quando a tela tem cabeçalho nativo. */
  safeTop?: boolean;
  /** Ativa o "puxar para atualizar". */
  onRefresh?: () => void;
  refreshing?: boolean;
};

/** Estrutura comum das telas: cabeçalho escuro da marca, conteúdo claro e rolagem. */
export function Screen({
  title,
  subtitle,
  eyebrow,
  children,
  hero,
  safeTop = true,
  onRefresh,
  refreshing = false,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingTop = (safeTop ? insets.top : 0) + spacing.md;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.accent}
            progressBackgroundColor={colors.surface}
            progressViewOffset={safeTop ? insets.top : 0}
          />
        ) : undefined
      }
    >
      <View style={[styles.hero, { paddingTop }]}>
        <BrandPattern />
        <View style={styles.heroText}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {hero}
      </View>

      <View style={styles.content}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1 },
  hero: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  heroText: { gap: spacing.xs },
  eyebrow: { ...typography.overline, color: colors.accent },
  title: { ...typography.title, color: colors.onInk },
  subtitle: { ...typography.body, color: colors.onInkMuted },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
});
