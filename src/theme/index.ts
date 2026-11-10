import { colors } from './colors';
import { radius, spacing } from './spacing';
import { fontSize, fontWeight, typography } from './typography';

export { colors, fontSize, fontWeight, radius, spacing, typography };

export const theme = { colors, spacing, radius, typography } as const;
