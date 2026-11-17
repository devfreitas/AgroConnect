import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlantationScreen } from '@/screens/plantation/PlantationScreen';
import { PropertyDetailScreen } from '@/screens/plantation/PropertyDetailScreen';
import { PropertyFormScreen } from '@/screens/plantation/PropertyFormScreen';
import type { PlantationStackParamList } from '@/types/navigation';

import { detailHeader } from '../headerOptions';

const Stack = createNativeStackNavigator<PlantationStackParamList>();

export function PlantationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Plantation" component={PlantationScreen} />
      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetailScreen}
        options={{ ...detailHeader, title: 'Propriedade' }}
      />
      <Stack.Screen
        name="PropertyForm"
        component={PropertyFormScreen}
        options={({ route }) => ({
          ...detailHeader,
          title: route.params?.propertyId ? 'Editar propriedade' : 'Nova propriedade',
        })}
      />
    </Stack.Navigator>
  );
}
