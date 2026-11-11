import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { ComponentProps } from 'react';

import { colors, typography } from '@/theme';
import type { AppTabParamList } from '@/types/navigation';

import { AnalyticsStack } from './stacks/AnalyticsStack';
import { HomeStack } from './stacks/HomeStack';
import { PlantationStack } from './stacks/PlantationStack';
import { ProfileStack } from './stacks/ProfileStack';
import { SensorsStack } from './stacks/SensorsStack';

type IconName = ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator<AppTabParamList>();

type TabIcons = { focused: IconName; default: IconName };

const tabIcons: Record<keyof AppTabParamList, TabIcons> = {
  HomeTab: { focused: 'home', default: 'home-outline' },
  PlantationTab: { focused: 'leaf', default: 'leaf-outline' },
  SensorsTab: { focused: 'hardware-chip', default: 'hardware-chip-outline' },
  AnalyticsTab: { focused: 'stats-chart', default: 'stats-chart-outline' },
  ProfileTab: { focused: 'person', default: 'person-outline' },
};

/** Área logada: cinco abas, cada uma com a sua pilha de telas. */
export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { ...typography.caption, fontWeight: '600' },
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? tabIcons[route.name].focused : tabIcons[route.name].default}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ title: 'Início', tabBarAccessibilityLabel: 'Aba Início' }}
      />
      <Tab.Screen
        name="PlantationTab"
        component={PlantationStack}
        options={{ title: 'Plantação', tabBarAccessibilityLabel: 'Aba Plantação' }}
      />
      <Tab.Screen
        name="SensorsTab"
        component={SensorsStack}
        options={{ title: 'Sensores', tabBarAccessibilityLabel: 'Aba Sensores' }}
      />
      <Tab.Screen
        name="AnalyticsTab"
        component={AnalyticsStack}
        options={{ title: 'Análises', tabBarAccessibilityLabel: 'Aba Análises' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Perfil', tabBarAccessibilityLabel: 'Aba Perfil' }}
      />
    </Tab.Navigator>
  );
}
