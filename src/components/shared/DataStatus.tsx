import { StyleSheet, Text } from 'react-native';

import { Notice } from '@/components/ui';
import type { ApiError } from '@/services';
import { colors, typography } from '@/theme';
import { formatDateTime } from '@/utils/format';

type DataStatusProps = {
  error: ApiError | null;
  updatedAt: Date | null;
  fromCache: boolean;
};

/**
 * Situação dos dados na tela. Mostra quando foram atualizados e, se a atualização falhou
 * (sem conexão, servidor lento etc.), avisa que os dados exibidos podem estar desatualizados.
 */
export function DataStatus({ error, updatedAt, fromCache }: DataStatusProps) {
  const when = updatedAt ? formatDateTime(updatedAt) : null;

  if (error && (error.kind === 'network' || error.kind === 'timeout')) {
    return (
      <Notice
        type="info"
        message={
          when
            ? `Sem conexão com o servidor. Exibindo dados salvos de ${when}.`
            : 'Sem conexão com o servidor.'
        }
      />
    );
  }

  if (error) {
    return <Notice type="error" message={`Não foi possível atualizar. ${error.message}`} />;
  }

  if (!when) return null;

  return (
    <Text style={styles.text}>
      Atualizado em {when}
      {fromCache ? ' (dados salvos, atualizando...)' : ''}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { ...typography.caption, color: colors.textMuted },
});
