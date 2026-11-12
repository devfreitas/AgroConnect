import { StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { appInfo } from '@/utils/appInfo';

export function AboutScreen() {
  return (
    <Screen
      title="Sobre o App"
      subtitle="Informações desta versão."
      safeTop={false}
    >
      <Card style={styles.card}>
        <Text style={styles.label}>Aplicativo</Text>
        <Text style={styles.value}>{appInfo.name}</Text>

        <Text style={styles.label}>Versão</Text>
        <Text style={styles.value}>{appInfo.version}</Text>

        <Text style={styles.label}>Commit</Text>
        <Text style={[styles.value, styles.mono]} selectable>
          {appInfo.commitHash}
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.heading}>Sobre o projeto</Text>
        <Text style={styles.body}>
          O AgroConnect ajuda pequenos produtores a acompanhar as condições da plantação,
          como umidade do solo, temperatura, umidade do ar e luminosidade, e a receber
          recomendações informativas geradas por inteligência artificial.
        </Text>
        <Text style={styles.body}>
          Projeto acadêmico desenvolvido para a Global Solution 2026/2 da FIAP. Os dados dos
          sensores exibidos nesta versão são fictícios, para demonstração, e nenhuma recomendação
          aciona equipamentos.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.xs },
  label: { ...typography.label, color: colors.textMuted, marginTop: spacing.sm },
  value: { ...typography.bodyStrong, color: colors.text },
  mono: { fontFamily: 'monospace' },
  heading: { ...typography.subheading, color: colors.text },
  body: { ...typography.body, color: colors.text, marginTop: spacing.xs },
});
