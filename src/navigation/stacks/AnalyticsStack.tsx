import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AnalyticsScreen } from '@/screens/analytics/AnalyticsScreen';
import type { AnalyticsStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<AnalyticsStackParamList>();

export function AnalyticsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
}
