import type { ViewStyle } from 'react-native';

/** Sombras quentes (tom café), nunca cinza puro. `elevation` cobre o Android. */
export const shadows = {
  none: {} as ViewStyle,
  sm: {
    shadowColor: '#382719',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  } as ViewStyle,
  md: {
    shadowColor: '#382719',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  } as ViewStyle,
  lg: {
    shadowColor: '#2A1D12',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  } as ViewStyle,
} as const;
