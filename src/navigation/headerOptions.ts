import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';

import { colors } from '@/theme';

/** Cabeçalho nativo das telas de detalhe: mesma faixa escura do cabeçalho das telas principais. */
export const detailHeader: NativeStackNavigationOptions = {
  headerShown: true,
  headerTintColor: colors.accent,
  headerStyle: { backgroundColor: colors.ink },
  headerTitleStyle: { color: colors.onInk, fontWeight: '700' },
  headerShadowVisible: false,
  headerBackButtonDisplayMode: 'minimal',
};
