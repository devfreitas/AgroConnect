import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme';
import { signalBars } from '@/utils/readings';

type SignalBarsProps = {
  rssi: number | null;
  /** Mostra o valor em dBm ao lado das barras. */
  showValue?: boolean;
};

/** Intensidade do sinal do dispositivo em quatro barras. */
export function SignalBars({ rssi, showValue = false }: SignalBarsProps) {
  const level = signalBars(rssi);
  const text = rssi === null ? 'Sem sinal registrado' : `Sinal ${level} de 4, ${rssi} dBm`;

  return (
    <View style={styles.row} accessible accessibilityLabel={text}>
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((bar) => (
          <View
            key={bar}
            style={[
              styles.bar,
              { height: 5 + bar * 4 },
              { backgroundColor: bar <= level ? colors.success : colors.border },
            ]}
          />
        ))}
      </View>
      {showValue ? <Text style={styles.value}>{rssi === null ? '—' : `${rssi} dBm`}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  bar: { width: 5, borderRadius: 2 },
  value: { ...typography.caption, color: colors.textMuted },
});
