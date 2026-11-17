import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import type { AppTabParamList } from '@/types/navigation';

import { FloatingTabBar } from './FloatingTabBar';
import { AnalyticsStack } from './stacks/AnalyticsStack';
import { HomeStack } from './stacks/HomeStack';
import { PlantationStack } from './stacks/PlantationStack';
import { ProfileStack } from './stacks/ProfileStack';
import { SensorsStack } from './stacks/SensorsStack';

const Tab = createBottomTabNavigator<AppTabParamList>();

/** Área logada: cinco abas, cada uma com a sua pilha de telas. */
export function AppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false }}
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
