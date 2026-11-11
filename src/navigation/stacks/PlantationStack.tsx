import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { PlantationScreen } from '@/screens/plantation/PlantationScreen';
import { PropertyDetailScreen } from '@/screens/plantation/PropertyDetailScreen';
import { PropertyFormScreen } from '@/screens/plantation/PropertyFormScreen';
import { colors } from '@/theme';
import type { PlantationStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<PlantationStackParamList>();

const nativeHeader = {
  headerShown: true,
  headerTintColor: colors.primary,
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,
} as const;

export function PlantationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Plantation" component={PlantationScreen} />
      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetailScreen}
        options={{ ...nativeHeader, title: 'Propriedade' }}
      />
      <Stack.Screen
        name="PropertyForm"
        component={PropertyFormScreen}
        options={({ route }) => ({
          ...nativeHeader,
          title: route.params?.propertyId ? 'Editar propriedade' : 'Nova propriedade',
        })}
      />
    </Stack.Navigator>
  );
}
