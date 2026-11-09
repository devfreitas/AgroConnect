import type { Alert, Device, Property, User } from '@/types/domain';

export type UserRecord = User & { password: string };
export type PropertyRecord = Property & { ownerId: string };
export type DeviceRecord = Omit<Device, 'status' | 'lastSeenAt'>;
export type AlertRecord = Alert & { ownerId: string };