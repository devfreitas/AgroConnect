import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { InfoRow } from '@/components/shared/InfoRow';
import { NotificationsSetting } from '@/components/shared/NotificationsSetting';
import { Screen } from '@/components/shared/Screen';
import { Button, Card, IconBadge, SectionHeader } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { colors, radius, spacing, typography, withAlpha } from '@/theme';
import type { ProfileStackScreenProps } from '@/types/navigation';
import { formatDate, initials } from '@/utils/format';

export function ProfileScreen({ navigation }: ProfileStackScreenProps<'Profile'>) {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  function confirmSignOut() {
    Alert.alert('Sair da conta', 'Deseja sair do AgroConnect neste aparelho?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          setSigningOut(true);
          void signOut();
        },
      },
    ]);
  }

  const hero = (
    <View
      style={styles.identity}
      accessible
      accessibilityLabel={`${user?.name ?? 'Usuário'}, ${user?.email ?? ''}`}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(user?.name)}</Text>
      </View>
      <View style={styles.identityText}>
        <Text style={styles.name} numberOfLines={1}>
          {user?.name ?? '—'}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {user?.email ?? '—'}
        </Text>
      </View>
    </View>
  );

  return (
    <Screen
      eyebrow="Sua conta"
      title="Perfil"
      subtitle="Dados da conta e configurações do app."
      hero={hero}
    >
      <SectionHeader title="Conta" />
      <Card>
        <InfoRow icon="person-outline" label="Nome" value={user?.name ?? '—'} />
        <View style={styles.divider} />
        <InfoRow icon="mail-outline" label="E-mail" value={user?.email ?? '—'} />
        {user?.createdAt ? (
          <>
            <View style={styles.divider} />
            <InfoRow
              icon="calendar-outline"
              label="Conta criada em"
              value={formatDate(user.createdAt)}
            />
          </>
        ) : null}
      </Card>

      <SectionHeader title="Configurações" />
      <NotificationsSetting />

      <Pressable
        onPress={() => navigation.navigate('About')}
        disabled={signingOut}
        accessibilityRole="button"
        accessibilityLabel="Sobre o App"
        accessibilityHint="Mostra a versão e informações do projeto"
        style={({ pressed }) => [styles.link, pressed && styles.pressed]}
      >
        <IconBadge icon="information-circle-outline" size={44} />
        <View style={styles.linkText}>
          <Text style={styles.linkTitle}>Sobre o App</Text>
          <Text style={styles.linkSub}>Versão, commit e informações do projeto</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.secondary} />
      </Pressable>

      <Button
        title="Sair da conta"
        icon="log-out-outline"
        onPress={confirmSignOut}
        variant="danger"
        loading={signingOut}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(colors.accent, 0.2),
    backgroundColor: colors.inkRaised,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  avatarText: { ...typography.heading, color: colors.primaryContrast, fontWeight: '800' },
  identityText: { flex: 1, gap: 2 },
  name: { ...typography.subheading, color: colors.onInk },
  email: { ...typography.caption, color: colors.onInkMuted },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 56 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.9 },
  linkText: { flex: 1, gap: 2 },
  linkTitle: { ...typography.bodyStrong, color: colors.text },
  linkSub: { ...typography.caption, lineHeight: 18, color: colors.textMuted },
});
