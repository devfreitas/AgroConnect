import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AboutScreen } from '@/screens/profile/AboutScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { colors } from '@/theme';
import type { ProfileStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          headerShown: true,
          title: 'Sobre o App',
          headerTintColor: colors.primary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
