import { StyleSheet, Text, View } from 'react-native';

import { BrandMark } from '@/components/shared/BrandMark';
import { InfoRow } from '@/components/shared/InfoRow';
import { Screen } from '@/components/shared/Screen';
import { Card } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { appInfo } from '@/utils/appInfo';

export function AboutScreen() {
  return (
    <Screen
      eyebrow="Informações desta versão"
      title="Sobre o App"
      safeTop={false}
      hero={
        <View style={styles.brand}>
          <BrandMark size={56} />
          <View style={styles.brandText}>
            <Text style={styles.brandName}>{appInfo.name}</Text>
            <Text style={styles.brandVersion}>Versão {appInfo.version}</Text>
          </View>
        </View>
      }
    >
      <Card>
        <InfoRow icon="apps-outline" label="Aplicativo" value={appInfo.name} />
        <View style={styles.divider} />
        <InfoRow icon="pricetag-outline" label="Versão" value={appInfo.version} />
        <View style={styles.divider} />
        <InfoRow
          icon="git-commit-outline"
          label="Commit"
          value={appInfo.commitHash}
          mono
          selectable
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.heading}>Sobre o projeto</Text>
        <Text style={styles.body}>
          O AgroConnect ajuda pequenos produtores a acompanhar as condições da plantação, como
          umidade do solo, temperatura, umidade do ar e luminosidade, e a receber recomendações
          informativas geradas por inteligência artificial.
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
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  brandText: { flex: 1, gap: 2 },
  brandName: { ...typography.heading, color: colors.onInk },
  brandVersion: { ...typography.caption, color: colors.onInkMuted },
  divider: { height: 1, backgroundColor: colors.border, marginLeft: 56 },
  card: { gap: spacing.sm },
  heading: { ...typography.subheading, color: colors.text },
  body: { ...typography.body, color: colors.text },
});
