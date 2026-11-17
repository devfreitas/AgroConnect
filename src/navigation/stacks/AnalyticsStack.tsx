import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AlertsScreen } from '@/screens/analytics/AlertsScreen';
import { AnalyticsScreen } from '@/screens/analytics/AnalyticsScreen';
import { RecommendationsScreen } from '@/screens/analytics/RecommendationsScreen';
import type { AnalyticsStackParamList } from '@/types/navigation';

import { detailHeader } from '../headerOptions';

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

export function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
      <Stack.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{ ...detailHeader, title: 'Alertas' }}
      />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{ ...detailHeader, title: 'Recomendações' }}
      />
    </Stack.Navigator>
  );
}
