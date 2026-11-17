import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AboutScreen } from '@/screens/profile/AboutScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import type { ProfileStackParamList } from '@/types/navigation';

import { detailHeader } from '../headerOptions';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ ...detailHeader, title: 'Sobre o App' }}
      />
    </Stack.Navigator>
  );
}
