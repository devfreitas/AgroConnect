import { StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { colors, withAlpha } from '@/theme';

/**
 * Curvas de nível (terraços de plantio) em tom dourado translúcido, usadas como textura
 * dos cabeçalhos escuros. Ocupa o espaço do pai e não recebe toque.
 */
export function BrandPattern() {
  const stroke = withAlpha(colors.accent, 0.1);

  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width="100%"
      height="100%"
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Path
          key={i}
          d={`M-20 ${190 - i * 22} C 80 ${150 - i * 22}, 160 ${230 - i * 22}, 260 ${180 - i * 22} S 380 ${130 - i * 22}, 430 ${170 - i * 22}`}
          stroke={stroke}
          strokeWidth={1.4}
          fill="none"
        />
      ))}
    </Svg>
  );
}
