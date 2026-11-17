import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DeviceDetailScreen } from '@/screens/sensors/DeviceDetailScreen';
import { SensorsScreen } from '@/screens/sensors/SensorsScreen';
import type { SensorsStackParamList } from '@/types/navigation';

import { detailHeader } from '../headerOptions';

const Stack = createNativeStackNavigator<SensorsStackParamList>();

export function SensorsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Sensors" component={SensorsScreen} />
      <Stack.Screen
        name="DeviceDetail"
        component={DeviceDetailScreen}
        options={{ ...detailHeader, title: 'Dispositivo' }}
      />
    </Stack.Navigator>
  );
}
