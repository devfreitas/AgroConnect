import { colors, withAlpha } from './colors';
import { shadows } from './shadows';
import { radius, spacing } from './spacing';
import { fontSize, fontWeight, typography } from './typography';

export { colors, fontSize, fontWeight, radius, shadows, spacing, typography, withAlpha };

export const theme = { colors, spacing, radius, shadows, typography } as const;
