import { useId, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
} from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors, radius, spacing, typography } from '@/theme';
import type { HistoryPoint } from '@/types/domain';
import { formatDateTime, formatDayMonth, formatTimeShort, parseApiDate } from '@/utils/format';

type LineChartProps = {
  points: HistoryPoint[];
  unit: string;
  height?: number;
  /** Cor da linha (padrão: terracota). */
  color?: string;
};

const PADDING = { top: 16, bottom: 8, left: 44, right: 12 };
const GRID_LINES = 4;
const MAX_DOTS = 40;

/**
 * Gráfico de linha com área, grade, eixo de valores e leitura ao tocar.
 * Pontos sem valor (value null) quebram a linha, formando lacunas.
 */
export function LineChart({ points, unit, height = 220, color = colors.primary }: LineChartProps) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const gradientId = `area${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const onLayout = (event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width);

  const valid = points.filter((point) => point.value !== null);
  if (valid.length === 0) return null;

  const times = points.map((point) => parseApiDate(point.timestamp).getTime());
  const values = valid.map((point) => point.value as number);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  let minValue = Math.min(...values);
  let maxValue = Math.max(...values);
  if (minValue === maxValue) {
    minValue -= 1;
    maxValue += 1;
  } else {
    // Folga de 8% para a linha não encostar nas bordas.
    const margin = (maxValue - minValue) * 0.08;
    minValue -= margin;
    maxValue += margin;
  }

  const innerWidth = Math.max(width - PADDING.left - PADDING.right, 1);
  const innerHeight = height - PADDING.top - PADDING.bottom;

  const x = (time: number) =>
    PADDING.left +
    (maxTime === minTime ? innerWidth / 2 : ((time - minTime) / (maxTime - minTime)) * innerWidth);
  const y = (value: number) =>
    PADDING.top + innerHeight - ((value - minValue) / (maxValue - minValue)) * innerHeight;

  // Trechos contínuos, quebrando nas lacunas (value null).
  const segments: { x: number; y: number }[][] = [[]];
  points.forEach((point, index) => {
    if (point.value === null) {
      if (segments[segments.length - 1].length > 0) segments.push([]);
      return;
    }
    segments[segments.length - 1].push({ x: x(times[index]), y: y(point.value) });
  });

  const baseline = PADDING.top + innerHeight;
  const linePath = (segment: { x: number; y: number }[]) =>
    segment.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = (segment: { x: number; y: number }[]) =>
    `${linePath(segment)} L${segment[segment.length - 1].x.toFixed(1)} ${baseline} L${segment[0].x.toFixed(1)} ${baseline} Z`;

  const gridValues = Array.from(
    { length: GRID_LINES },
    (_, i) => minValue + ((maxValue - minValue) * i) / (GRID_LINES - 1),
  );

  const format = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

  const spanHours = (maxTime - minTime) / 3_600_000;
  const axisLabel = (time: number) => {
    const date = new Date(time);
    return spanHours <= 36 ? formatTimeShort(date) : formatDayMonth(date);
  };
  const axisTimes = [minTime, minTime + (maxTime - minTime) / 2, maxTime];

  const lastIndex = points.reduce((last, point, index) => (point.value === null ? last : index), 0);
  const active = selected !== null && points[selected]?.value !== null ? selected : lastIndex;
  const activePoint = points[active];

  function pick(event: GestureResponderEvent) {
    const touchX = event.nativeEvent.locationX;
    let best = -1;
    let bestDistance = Infinity;
    points.forEach((point, index) => {
      if (point.value === null) return;
      const distance = Math.abs(x(times[index]) - touchX);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = index;
      }
    });
    if (best >= 0) setSelected(best);
  }

  return (
    <View
      accessible
      accessibilityLabel={`Gráfico de ${valid.length} pontos, de ${format(Math.min(...values))} a ${format(Math.max(...values))} ${unit}, entre ${formatDateTime(points[0].timestamp)} e ${formatDateTime(points[points.length - 1].timestamp)}.`}
    >
      <View style={styles.readout}>
        <Text style={styles.readoutValue}>
          {format(activePoint.value as number)}
          <Text style={styles.readoutUnit}> {unit}</Text>
        </Text>
        <Text style={styles.readoutTime}>
          {formatDateTime(activePoint.timestamp)}
          {selected === null ? ' · mais recente' : ''}
        </Text>
      </View>

      <View
        onLayout={onLayout}
        style={{ height }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={pick}
        onResponderMove={pick}
      >
        {width > 0 ? (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={color} stopOpacity={0.3} />
                <Stop offset="1" stopColor={color} stopOpacity={0.02} />
              </LinearGradient>
            </Defs>

            {gridValues.map((value) => (
              <Line
                key={value}
                x1={PADDING.left}
                x2={width - PADDING.right}
                y1={y(value)}
                y2={y(value)}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 5"
              />
            ))}

            {segments.map((segment, index) =>
              segment.length > 1 ? (
                <Path key={`a${index}`} d={areaPath(segment)} fill={`url(#${gradientId})`} />
              ) : null,
            )}
            {segments.map((segment, index) =>
              segment.length > 1 ? (
                <Path
                  key={`l${index}`}
                  d={linePath(segment)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2.75}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              ) : null,
            )}

            {valid.length <= MAX_DOTS
              ? points.map((point, index) =>
                  point.value === null ? null : (
                    <Circle
                      key={point.timestamp}
                      cx={x(times[index])}
                      cy={y(point.value)}
                      r={2.5}
                      fill={colors.surface}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                  ),
                )
              : null}

            <Line
              x1={x(times[active])}
              x2={x(times[active])}
              y1={PADDING.top}
              y2={baseline}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="3 3"
              opacity={0.6}
            />
            <Circle
              cx={x(times[active])}
              cy={y(activePoint.value as number)}
              r={9}
              fill={color}
              opacity={0.18}
            />
            <Circle
              cx={x(times[active])}
              cy={y(activePoint.value as number)}
              r={5}
              fill={color}
              stroke={colors.surface}
              strokeWidth={2}
            />
          </Svg>
        ) : null}

        {width > 0
          ? gridValues.map((value) => (
              <Text key={value} style={[styles.yLabel, { top: y(value) - 8 }]}>
                {format(value)}
              </Text>
            ))
          : null}
      </View>

      <View style={styles.axis}>
        {axisTimes.map((time, index) => (
          <Text
            key={index}
            style={[
              styles.axisText,
              index === 1 && styles.axisCenter,
              index === 2 && styles.axisEnd,
            ]}
          >
            {axisLabel(time)}
          </Text>
        ))}
      </View>
      <Text style={styles.hint}>Toque no gráfico para ver cada leitura.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  readout: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  readoutValue: {
    ...typography.heading,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: colors.text,
  },
  readoutUnit: { ...typography.label, color: colors.textMuted },
  readoutTime: { ...typography.caption, color: colors.textMuted },
  yLabel: {
    position: 'absolute',
    left: 0,
    width: PADDING.left - 8,
    textAlign: 'right',
    ...typography.caption,
    fontSize: 11,
    lineHeight: 16,
    color: colors.textMuted,
  },
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: PADDING.left,
    paddingRight: PADDING.right,
    marginTop: spacing.xs,
  },
  axisText: { ...typography.caption, fontSize: 11, color: colors.textMuted },
  axisCenter: { textAlign: 'center' },
  axisEnd: { textAlign: 'right' },
  hint: {
    ...typography.caption,
    fontSize: 11,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    borderRadius: radius.sm,
  },
});
