import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AlertsScreen } from '@/screens/analytics/AlertsScreen';
import { AnalyticsScreen } from '@/screens/analytics/AnalyticsScreen';
import { RecommendationsScreen } from '@/screens/analytics/RecommendationsScreen';
import { colors } from '@/theme';
import type { AnalyticsStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

const nativeHeader = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
} as const;

export function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ ...nativeHeader, title: 'Alertas' }}
      />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{ ...nativeHeader, title: 'Recomendações' }}
      />
    </Stack.Navigator>
  );
}
