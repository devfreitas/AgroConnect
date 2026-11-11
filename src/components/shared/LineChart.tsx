import { useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { colors, spacing, typography } from '@/theme';
import type { HistoryPoint } from '@/types/domain';
import { formatDateTime } from '@/utils/format';

type LineChartProps = {
  points: HistoryPoint[];
  unit: string;
  height?: number;
};

const PADDING = { top: 12, bottom: 12, left: 8, right: 8 };
const GRID_LINES = 3;

/** Gráfico de linha simples. Pontos sem valor (value null) quebram a linha, formando lacunas. */
export function LineChart({ points, unit, height = 200 }: LineChartProps) {
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const valid = points.filter((point) => point.value !== null);
  if (valid.length === 0) return null;

  const times = points.map((point) => new Date(point.timestamp).getTime());
  const values = valid.map((point) => point.value as number);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (minValue === maxValue) {
    minValue -= 1;
    maxValue += 1;
  }

  const innerWidth = Math.max(width - PADDING.left - PADDING.right, 1);
  const innerHeight = height - PADDING.top - PADDING.bottom;

  const x = (time: number) =>
    PADDING.left + (maxTime === minTime ? innerWidth / 2 : ((time - minTime) / (maxTime - minTime)) * innerWidth);
  const y = (value: number) =>
    PADDING.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;

  // Divide em trechos contínuos, quebrando nas lacunas (value null).
  const segments: string[][] = [[]];
  points.forEach((point, index) => {
    if (point.value === null) {
      if (segments[segments.length - 1].length > 0) segments.push([]);
      return;
    }
    segments[segments.length - 1].push(`${x(times[index]).toFixed(1)},${y(point.value).toFixed(1)}`);
  });

  const gridValues = Array.from(
    { length: GRID_LINES },
    (_, i) => minValue + ((maxValue - minValue) * i) / (GRID_LINES - 1),
  );

  const format = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

  return (
    <View
      accessible
      accessibilityLabel={`Gráfico de ${valid.length} pontos, de ${format(minValue)} a ${format(maxValue)} ${unit}, entre ${formatDateTime(points[0].timestamp)} e ${formatDateTime(points[points.length - 1].timestamp)}.`}
    >
      <View onLayout={onLayout} style={{ height }}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            {gridValues.map((value) => (
              <Line
                key={value}
                x1={PADDING.left}
                x2={width - PADDING.right}
                y1={y(value)}
                y2={y(value)}
                stroke={colors.border}
                strokeWidth={1}
              />
            ))}
            {segments.map((segment, index) =>
              segment.length > 1 ? (
                <Polyline
                  key={index}
                  points={segment.join(' ')}
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null,
            )}
            {valid.length <= 60
              ? points.map((point, index) =>
                  point.value === null ? null : (
                    <Circle
                      key={point.timestamp}
                      cx={x(times[index])}
                      cy={y(point.value)}
                      r={3}
                      fill={colors.primary}
                    />
                  ),
                )
              : null}
          </Svg>
        ) : null}
      </View>

      <View style={styles.axis}>
        <Text style={styles.axisText}>{formatDateTime(points[0].timestamp)}</Text>
        <Text style={styles.axisText}>{formatDateTime(points[points.length - 1].timestamp)}</Text>
      </View>
      <Text style={styles.axisText}>
        Escala: {format(minValue)} a {format(maxValue)} {unit}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xs },
  axisText: { ...typography.caption, color: colors.textMuted },
});
