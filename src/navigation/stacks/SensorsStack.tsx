import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SensorsScreen } from '@/screens/sensors/SensorsScreen';
import type { SensorsStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<SensorsStackParamList>();

export function SensorsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sensors" component={SensorsScreen} />
    </Stack.Navigator>
  );
}
