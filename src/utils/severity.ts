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

/** Fundo suave de cada severidade, para ícones e destaques. */
export const SEVERITY_SOFT: Record<AlertSeverity, string> = {
  INFO: colors.infoSoft,
  WARNING: colors.warningSoft,
  CRITICAL: colors.errorSoft,
};

/** Peso para ordenar do mais grave para o menos grave. */
export const SEVERITY_RANK: Record<AlertSeverity, number> = { CRITICAL: 3, WARNING: 2, INFO: 1 };
