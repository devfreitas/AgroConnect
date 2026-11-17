import Svg, { G, Path, Rect } from 'react-native-svg';

import { colors } from '@/theme';

import { BRAND_GLYPH_HEIGHT, BRAND_GLYPH_PATH, BRAND_GLYPH_WIDTH } from './brandGlyph';

type BrandMarkProps = {
  size?: number;
  /** `tile`: quadrado arredondado terracota (padrão). `glyph`: só o símbolo, na cor indicada. */
  variant?: 'tile' | 'glyph';
  color?: string;
};

const CREAM = '#FBF3E8';

/** Símbolo do AgroConnect (logo oficial vetorizada). */
export function BrandMark({ size = 56, variant = 'tile', color = colors.primary }: BrandMarkProps) {
  const hidden = {
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
  } as const;

  if (variant === 'glyph') {
    const height = size;
    const width = (size * BRAND_GLYPH_WIDTH) / BRAND_GLYPH_HEIGHT;
    return (
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${BRAND_GLYPH_WIDTH} ${BRAND_GLYPH_HEIGHT}`}
        {...hidden}
      >
        <Path d={BRAND_GLYPH_PATH} fill={color} fillRule="evenodd" />
      </Svg>
    );
  }

  // O símbolo ocupa ~60% da altura do quadrado, centralizado.
  const box = 100;
  const scale = (box * 0.6) / BRAND_GLYPH_HEIGHT;
  const tx = (box - BRAND_GLYPH_WIDTH * scale) / 2;
  const ty = (box - BRAND_GLYPH_HEIGHT * scale) / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${box} ${box}`} {...hidden}>
      <Rect width={box} height={box} rx={26} fill={color} />
      <G transform={`translate(${tx} ${ty}) scale(${scale})`}>
        <Path d={BRAND_GLYPH_PATH} fill={CREAM} fillRule="evenodd" />
      </G>
    </Svg>
  );
}
