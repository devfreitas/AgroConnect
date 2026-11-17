import { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { colors, withAlpha } from '@/theme';

const native = Platform.OS !== 'web';
const HEIGHT = 200;
const BLEED = 40; // sobra lateral para as colinas poderem deslizar sem mostrar a borda

/** Vai e volta, devagar, em um movimento suave (seno). */
function useSway(distance: number, duration: number, enabled: boolean) {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!enabled) {
      value.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [duration, enabled, value]);

  return value.interpolate({ inputRange: [0, 1], outputRange: [-distance, distance] });
}

/**
 * Cenário de campo para as telas de acesso: um sol que pulsa de leve e três colinas com sulcos
 * de plantio, em movimento lento (parallax). Totalmente decorativo e escondido de leitores de tela.
 */
export function FieldBackdrop() {
  const { width } = useWindowDimensions();
  const reduced = useReducedMotion();
  const animate = !reduced;

  const far = useSway(14, 9000, animate);
  const mid = useSway(22, 7000, animate);
  const near = useSway(30, 5500, animate);

  const sun = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animate) {
      sun.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(sun, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
        Animated.timing(sun, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: native,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [animate, sun]);

  const layerWidth = width + BLEED * 2;
  const layer = [styles.layer, { width: layerWidth, left: -BLEED }];

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Animated.View
        style={[
          styles.sun,
          {
            opacity: sun.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
            transform: [{ scale: sun.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }],
          },
        ]}
      />

      <Animated.View style={[layer, { transform: [{ translateX: far }] }]}>
        <Svg width="100%" height={HEIGHT} viewBox="0 0 400 200" preserveAspectRatio="none">
          <Path
            d="M0 92 C 80 52, 160 62, 240 86 S 340 112, 400 72 L400 200 L0 200 Z"
            fill={withAlpha(colors.accent, 0.22)}
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[layer, { transform: [{ translateX: mid }] }]}>
        <Svg width="100%" height={HEIGHT} viewBox="0 0 400 200" preserveAspectRatio="none">
          <Path
            d="M0 132 C 90 96, 170 122, 250 130 S 350 108, 400 120 L400 200 L0 200 Z"
            fill={withAlpha(colors.primary, 0.1)}
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[layer, { transform: [{ translateX: near }] }]}>
        <Svg width="100%" height={HEIGHT} viewBox="0 0 400 200" preserveAspectRatio="none">
          <Path
            d="M0 166 C 100 140, 200 162, 290 152 S 370 152, 400 148 L400 200 L0 200 Z"
            fill={withAlpha(colors.primary, 0.16)}
          />
          {/* Sulcos de plantio acompanhando a curva da colina */}
          <Path
            d="M0 180 C 100 156, 200 178, 290 168 S 370 168, 400 165"
            stroke={withAlpha(colors.primaryDark, 0.28)}
            strokeWidth={1.5}
            fill="none"
          />
          <Path
            d="M0 192 C 100 172, 200 190, 290 182 S 370 182, 400 180"
            stroke={withAlpha(colors.primaryDark, 0.2)}
            strokeWidth={1.5}
            fill="none"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sun: {
    position: 'absolute',
    top: -140,
    right: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: withAlpha(colors.accent, 0.2),
  },
  layer: { position: 'absolute', bottom: 0, height: HEIGHT },
});
