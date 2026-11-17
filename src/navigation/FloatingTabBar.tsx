import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, shadows } from '@/theme';
import type { AppTabParamList } from '@/types/navigation';

type IconName = ComponentProps<typeof Ionicons>['name'];

const tabIcons: Record<keyof AppTabParamList, { focused: IconName; default: IconName }> = {
  HomeTab: { focused: 'home', default: 'home-outline' },
  PlantationTab: { focused: 'leaf', default: 'leaf-outline' },
  SensorsTab: { focused: 'hardware-chip', default: 'hardware-chip-outline' },
  AnalyticsTab: { focused: 'stats-chart', default: 'stats-chart-outline' },
  ProfileTab: { focused: 'person', default: 'person-outline' },
};

/** Esconde a barra enquanto o teclado está aberto (o componente padrão faz isso, o nosso também). */
function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return visible;
}

/**
 * Barra de abas flutuante: uma pílula clara com os ícones, e a aba ativa em um círculo terracota.
 * Fica fora do conteúdo (o fundo da faixa é o mesmo das telas), então nada passa por baixo dela.
 */
export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();

  if (keyboardVisible) return null;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.pill} accessibilityRole="tablist">
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const icons = tabIcons[route.name as keyof AppTabParamList];
          const label = options.tabBarAccessibilityLabel ?? options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              hitSlop={4}
              style={styles.item}
            >
              <View style={[styles.circle, focused && styles.circleActive]}>
                <Ionicons
                  name={focused ? icons.focused : icons.default}
                  size={22}
                  color={focused ? colors.primaryContrast : colors.textMuted}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 8,
    paddingHorizontal: 20,
    backgroundColor: colors.canvas,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...shadows.md,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: colors.primary },
});
