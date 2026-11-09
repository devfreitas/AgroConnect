import type { Device, Field, Planting, Property, Sensor, User } from '@/types/domain';
import { getLastSeenMs } from './readings';
import { createSeedData } from './seed';
import type { AlertRecord, DeviceRecord, PropertyRecord, UserRecord } from './types';

type MockDb = {
  users: UserRecord[];
  properties: PropertyRecord[];
  fields: Field[];
  plantings: Planting[];
  devices: DeviceRecord[];
  sensors: Sensor[];
  alerts: AlertRecord[];
};

/** Banco em memória. Reiniciar o app restaura os dados iniciais. */
export const db: MockDb = createSeedData(Date.now());

export function newId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function toPublicUser(user: UserRecord): User {
  return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
}

export function toPublicProperty(record: PropertyRecord): Property {
  return {
    id: record.id,
    name: record.name,
    city: record.city,
    state: record.state,
    areaHectares: record.areaHectares,
    description: record.description,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/** Token do mock: "mock.<userId>.<timestamp>". Não expira. */
export function makeToken(userId: string): string {
  return `mock.${userId}.${Date.now().toString(36)}`;
}

export function userIdFromToken(token: string): string | null {
  const [prefix, userId] = token.split('.');
  if (prefix !== 'mock' || !userId) return null;
  return db.users.some((user) => user.id === userId) ? userId : null;
}

export function ownedFieldIds(userId: string): Set<string> {
  const propertyIds = new Set(
    db.properties.filter((p) => p.ownerId === userId).map((p) => p.id),
  );
  return new Set(db.fields.filter((f) => propertyIds.has(f.propertyId)).map((f) => f.id));
}

export function findOwnedProperty(userId: string, id: string): PropertyRecord | undefined {
  return db.properties.find((p) => p.id === id && p.ownerId === userId);
}

export function findOwnedField(userId: string, id: string): Field | undefined {
  return db.fields.find((f) => f.id === id && ownedFieldIds(userId).has(f.id));
}

export function findOwnedDevice(userId: string, id: string): DeviceRecord | undefined {
  const owned = ownedFieldIds(userId);
  return db.devices.find((d) => d.id === id && owned.has(d.fieldId));
}

/** Estado calculado a partir da última comunicação (como faria o backend real). */
export function toDevice(record: DeviceRecord, nowMs: number = Date.now()): Device {
  const lastSeenMs = getLastSeenMs(record.id, nowMs);

  if (lastSeenMs === null) {
    return { ...record, status: 'UNKNOWN', lastSeenAt: null };
  }

  const ageMs = nowMs - lastSeenMs;
  const status = ageMs <= 20 * 60_000 ? 'ONLINE' : ageMs <= 60 * 60_000 ? 'UNSTABLE' : 'OFFLINE';

  return { ...record, status, lastSeenAt: new Date(lastSeenMs).toISOString() };
}

export function removePropertyCascade(propertyId: string): void {
  const fieldIds = db.fields.filter((f) => f.propertyId === propertyId).map((f) => f.id);
  const deviceIds = db.devices.filter((d) => fieldIds.includes(d.fieldId)).map((d) => d.id);

  db.alerts = db.alerts.filter((a) => !deviceIds.includes(a.deviceId));
  db.sensors = db.sensors.filter((s) => !deviceIds.includes(s.deviceId));
  db.devices = db.devices.filter((d) => !deviceIds.includes(d.id));
  db.plantings = db.plantings.filter((p) => !fieldIds.includes(p.fieldId));
  db.fields = db.fields.filter((f) => f.propertyId !== propertyId);
  db.properties = db.properties.filter((p) => p.id !== propertyId);
}