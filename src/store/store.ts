import type { AppState, SessionUser, StatusUpdate } from '@/types';
import { seedState } from '@/data/seed';

const STORAGE_KEY = 'cmpts-demo-state';
const SESSION_KEY = 'cmpts-session';
const OTP_KEY = 'cmpts-otp';
const VERSION_KEY = 'cmpts-seed-version';

// Bump this whenever the seed shape/accounts change so existing browsers get a
// clean reset (otherwise a stale persisted `staff` list hides new demo logins).
const SEED_VERSION = '2026-06-26-hierarchy-4';

type Listener = () => void;
const listeners = new Set<Listener>();

let state: AppState = loadState();

function loadState(): AppState {
  try {
    const storedVersion = localStorage.getItem(VERSION_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && storedVersion === SEED_VERSION) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      // Same-version merge keeps user-created complaints/updates while
      // backfilling any collections added since this browser last saved.
      return { ...structuredClone(seedState), ...parsed } as AppState;
    }
  } catch {
    /* ignore */
  }
  // Fresh seed (first run, or seed version changed): persist so every tab and
  // the demo accounts are immediately consistent.
  const fresh = structuredClone(seedState);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    localStorage.setItem(VERSION_KEY, SEED_VERSION);
  } catch {
    /* ignore */
  }
  return fresh;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  localStorage.setItem(VERSION_KEY, SEED_VERSION);
  listeners.forEach((l) => l());
}

// Keep all open tabs (e.g. the desktop portal and the field app) in sync. The
// `storage` event only fires in *other* tabs, so the originating tab still
// relies on the in-memory listeners above.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY || e.key === VERSION_KEY) {
      state = loadState();
      listeners.forEach((l) => l());
    } else if (e.key === SESSION_KEY) {
      listeners.forEach((l) => l());
    }
  });
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
    // Stored in localStorage (not sessionStorage) so a single login is shared
    // across the desktop portal and the field app, even in separate tabs.
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser | null) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
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
