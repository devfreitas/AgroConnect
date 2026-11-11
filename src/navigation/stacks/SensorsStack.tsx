import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DeviceDetailScreen } from '@/screens/sensors/DeviceDetailScreen';
import { SensorsScreen } from '@/screens/sensors/SensorsScreen';
import { colors } from '@/theme';
import type { SensorsStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<SensorsStackParamList>();

export function SensorsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sensors" component={SensorsScreen} />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={{
          headerShown: true,
          title: 'Dispositivo',
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
