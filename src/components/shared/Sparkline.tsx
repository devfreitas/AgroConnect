import { useId, useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { withAlpha } from '@/theme';

type SparklineProps = {
  values: (number | null)[];
  color: string;
  height?: number;
};

/** Mini gráfico de tendência, sem eixos. Decorativo: o valor atual vem em texto ao lado. */
export function Sparkline({ values, color, height = 36 }: SparklineProps) {
  const [width, setWidth] = useState(0);
  const gradientId = `spark${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  const valid = values.filter((value): value is number => value !== null);
  if (valid.length < 2) return <View style={{ height }} />;

  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const span = max - min || 1;
  const pad = 3;

  const step = values.length > 1 ? (width - pad * 2) / (values.length - 1) : 0;
  const y = (value: number) => pad + (height - pad * 2) * (1 - (value - min) / span);

  let line = '';
  let started = false;
  let lastX = pad;
  let firstX: number | null = null;
  values.forEach((value, index) => {
    if (value === null) {
      started = false;
      return;
    }
    const x = pad + step * index;
    if (!started) {
      line += `${line ? ' ' : ''}M${x.toFixed(1)} ${y(value).toFixed(1)}`;
      started = true;
      if (firstX === null) firstX = x;
    } else {
      line += ` L${x.toFixed(1)} ${y(value).toFixed(1)}`;
    }
    lastX = x;
  });

  const area = `${line} L${lastX.toFixed(1)} ${height} L${(firstX ?? pad).toFixed(1)} ${height} Z`;

  return (
    <View
      style={{ height }}
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity={0.28} />
              <Stop offset="1" stopColor={color} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <Path d={area} fill={`url(#${gradientId})`} />
          <Path
            d={line}
            fill="none"
            stroke={withAlpha(color, 1)}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ) : null}
    </View>
  );
}
