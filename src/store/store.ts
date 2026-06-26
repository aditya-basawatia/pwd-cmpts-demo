import type { AppState, SessionUser, StatusUpdate } from '@/types';
import { seedState } from '@/data/seed';

const STORAGE_KEY = 'cmpts-demo-state';
const SESSION_KEY = 'cmpts-session';
const OTP_KEY = 'cmpts-otp';

type Listener = () => void;
const listeners = new Set<Listener>();

let state: AppState = loadState();

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      // Forward-compatible merge: older persisted state may predate the
      // hierarchy (orgUnits) feature, so backfill any missing collections.
      return { ...structuredClone(seedState), ...parsed } as AppState;
    }
  } catch {
    /* ignore */
  }
  return structuredClone(seedState);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getState(): AppState {
  return state;
}

export function resetDemo() {
  state = structuredClone(seedState);
  saveState();
}

export function updateState(updater: (s: AppState) => AppState) {
  state = updater(state);
  saveState();
}

export function getSession(): SessionUser | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser | null) {
  if (user) sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else sessionStorage.removeItem(SESSION_KEY);
  listeners.forEach((l) => l());
}

export function generateId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateTicketId() {
  const num = state.complaints.length + 1;
  return `PWD-2026-${String(num).padStart(4, '0')}`;
}

export interface OtpRecord {
  mobile: string;
  code: string;
  expiresAt: number;
}

export function setOtp(mobile: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const record: OtpRecord = { mobile, code, expiresAt: Date.now() + 5 * 60 * 1000 };
  sessionStorage.setItem(OTP_KEY, JSON.stringify(record));
  return code;
}

export function verifyOtp(mobile: string, code: string): boolean {
  try {
    const raw = sessionStorage.getItem(OTP_KEY);
    if (!raw) return false;
    const record = JSON.parse(raw) as OtpRecord;
    return record.mobile === mobile && record.code === code && Date.now() < record.expiresAt;
  } catch {
    return false;
  }
}

export function getCurrentOtp(): OtpRecord | null {
  try {
    const raw = sessionStorage.getItem(OTP_KEY);
    return raw ? (JSON.parse(raw) as OtpRecord) : null;
  } catch {
    return null;
  }
}

export function addAuditLog(
  action: string,
  entity: string,
  entityId: string,
  userId?: string,
  userName?: string,
  details?: string,
) {
  updateState((s) => ({
    ...s,
    auditLogs: [
      {
        id: generateId('al'),
        action,
        entity,
        entityId,
        userId,
        userName,
        details,
        createdAt: new Date().toISOString(),
      },
      ...s.auditLogs,
    ],
  }));
}

export function addStatusUpdate(
  update: Omit<StatusUpdate, 'id' | 'createdAt'> & { createdAt?: string },
) {
  const entry: StatusUpdate = {
    ...update,
    id: generateId('su'),
    createdAt: update.createdAt ?? new Date().toISOString(),
  };
  updateState((s) => ({
    ...s,
    statusUpdates: [entry, ...s.statusUpdates],
    projects: s.projects.map((p) =>
      p.id === entry.projectId
        ? {
            ...p,
            completionPercent: entry.completionPercent,
            status: entry.completionPercent >= 100 ? 'completed' : p.status === 'planned' ? 'in_progress' : p.status,
          }
        : p,
    ),
  }));
  return entry;
}

export function addNotification(channel: 'sms' | 'email' | 'push', recipient: string, message: string) {
  updateState((s) => ({
    ...s,
    notifications: [
      {
        id: generateId('n'),
        channel,
        recipient,
        message,
        createdAt: new Date().toISOString(),
      },
      ...s.notifications,
    ],
  }));
}
