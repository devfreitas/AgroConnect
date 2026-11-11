import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlantationScreen } from '@/screens/plantation/PlantationScreen';
import type { PlantationStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<PlantationStackParamList>();

export function PlantationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Plantation" component={PlantationScreen} />
    </Stack.Navigator>
  );
}
