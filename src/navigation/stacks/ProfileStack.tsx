import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import type { ProfileStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
