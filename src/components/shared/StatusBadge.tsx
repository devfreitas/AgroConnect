import { Badge, type BadgeTone } from '@/components/ui';
import type { DeviceStatus } from '@/types/domain';
import { DEVICE_STATUS_LABELS } from '@/utils/readings';

const statusStyle: Record<
  DeviceStatus,
  { icon: 'checkmark-circle' | 'warning' | 'close-circle' | 'help-circle'; tone: BadgeTone }
> = {
  ONLINE: { icon: 'checkmark-circle', tone: 'success' },
  UNSTABLE: { icon: 'warning', tone: 'warning' },
  OFFLINE: { icon: 'close-circle', tone: 'error' },
  UNKNOWN: { icon: 'help-circle', tone: 'neutral' },
};

/** Estado do dispositivo em ícone e texto (a cor nunca é o único indicador). */
export function StatusBadge({ status }: { status: DeviceStatus }) {
  const { icon, tone } = statusStyle[status];
  return <Badge label={DEVICE_STATUS_LABELS[status]} tone={tone} icon={icon} />;
}
