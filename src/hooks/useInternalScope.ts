import { useMemo } from 'react';
import { useStore } from '@/hooks/useStore';
import { useSession } from '@/hooks/useSession';
import { buildVisibleTree } from '@/lib/hierarchy';
import { hasDivisionAccess } from '@/lib/rbac';
import type { Complaint, Project, StaffRole } from '@/types';

function projectInScope(
  p: Project,
  visibleUnitIds: Set<string>,
  role: StaffRole,
  divisionIds: string[],
) {
  if (p.orgUnitId) return visibleUnitIds.has(p.orgUnitId);
  return hasDivisionAccess(role, divisionIds, p.divisionId);
}

/** Shared hierarchy scoping for the desktop internal portal. */
export function useInternalScope() {
  const state = useStore();
  const { session, staff, visibleUnitIds } = useSession();

  const orgUnitId = staff?.orgUnitId ?? session?.orgUnitId ?? null;
  const tree = useMemo(() => buildVisibleTree(state.orgUnits, orgUnitId), [state.orgUnits, orgUnitId]);

  const scopedProjects = useMemo(() => {
    if (!session) return [] as Project[];
    return state.projects.filter((p) =>
      projectInScope(p, visibleUnitIds, session.role, session.divisionIds),
    );
  }, [state.projects, session, visibleUnitIds]);

  const scopedComplaints = useMemo(() => {
    if (!session) return [] as Complaint[];
    const projectIds = new Set(scopedProjects.map((p) => p.id));
    return state.complaints.filter((c) => projectIds.has(c.projectId));
  }, [state.complaints, scopedProjects, session]);

  return {
    session,
    staff,
    visibleUnitIds,
    orgUnits: state.orgUnits,
    tree,
    orgUnitId,
    scopedProjects,
    scopedComplaints,
    allStaff: state.staff,
  };
}
