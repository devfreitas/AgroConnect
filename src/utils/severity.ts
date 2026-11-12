import { colors } from '@/theme';
import type { AlertSeverity, AlertStatus } from '@/types/domain';

type IconName = 'information-circle' | 'warning' | 'alert-circle';

export const SEVERITY_INFO: Record<
  AlertSeverity,
  { label: string; icon: IconName; color: string }
> = {
  INFO: { label: 'Informação', icon: 'information-circle', color: colors.info },
  WARNING: { label: 'Atenção', icon: 'warning', color: colors.warning },
  CRITICAL: { label: 'Importante', icon: 'alert-circle', color: colors.error },
};

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  UNREAD: 'Não lido',
  READ: 'Lido',
  RESOLVED: 'Resolvido',
};
