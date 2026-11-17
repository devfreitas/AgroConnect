import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

/** Nomes de ícones do Ionicons aceitos pelos componentes. */
export type IconName = ComponentProps<typeof Ionicons>['name'];
