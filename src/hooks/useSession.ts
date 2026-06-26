import { useEffect, useState } from 'react';
import { getSession, getState, subscribe } from '@/store/store';
import { getVisibleUnitIds } from '@/lib/hierarchy';
import type { SessionUser, StaffUser } from '@/types';

export interface SessionInfo {
  session: SessionUser | null;
  staff: StaffUser | null;
  visibleUnitIds: Set<string>;
}

/**
 * Reactive access to the logged-in officer, their full staff record, and the
 * set of org units they are authorised to see.
 */
export function useSession(): SessionInfo {
  const [, force] = useState(0);
  useEffect(() => {
    const unsub = subscribe(() => force((n) => n + 1));
    return () => {
      unsub();
    };
  }, []);

  const session = getSession();
  const state = getState();
  const staff = session ? state.staff.find((s) => s.id === session.id) ?? null : null;
  const orgUnitId = staff?.orgUnitId ?? session?.orgUnitId;
  const visibleUnitIds = getVisibleUnitIds(state.orgUnits, orgUnitId);

  return { session, staff, visibleUnitIds };
}
