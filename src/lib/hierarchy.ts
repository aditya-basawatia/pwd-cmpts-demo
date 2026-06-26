import type { Complaint, OrgLevel, OrgUnit, Project, StaffUser } from '@/types';

export const levelLabels: Record<OrgLevel, { en: string; hi: string }> = {
  state: { en: 'State', hi: 'राज्य' },
  zone: { en: 'Zone', hi: 'क्षेत्र' },
  circle: { en: 'Circle', hi: 'वृत्त' },
  division: { en: 'Division', hi: 'मंडल' },
  subdivision: { en: 'Sub-Division', hi: 'उपमंडल' },
};

export const levelHeadDesignation: Record<OrgLevel, string> = {
  state: 'Engineer-in-Chief',
  zone: 'Chief Engineer',
  circle: 'Superintending Engineer',
  division: 'Executive Engineer',
  subdivision: 'Sub-Divisional Officer',
};

export function getUnit(units: OrgUnit[], id?: string | null): OrgUnit | undefined {
  if (!id) return undefined;
  return units.find((u) => u.id === id);
}

export function getChildren(units: OrgUnit[], parentId: string | null): OrgUnit[] {
  return units.filter((u) => u.parentId === parentId);
}

/** All descendant unit ids, inclusive of the root unit itself. */
export function getDescendantIds(units: OrgUnit[], rootId: string): string[] {
  const result: string[] = [];
  const walk = (id: string) => {
    result.push(id);
    for (const child of units.filter((u) => u.parentId === id)) walk(child.id);
  };
  walk(rootId);
  return result;
}

/** Ancestors from immediate parent up to the root (excludes the unit itself). */
export function getAncestors(units: OrgUnit[], id: string): OrgUnit[] {
  const chain: OrgUnit[] = [];
  let current = getUnit(units, id);
  while (current?.parentId) {
    const parent = getUnit(units, current.parentId);
    if (!parent) break;
    chain.push(parent);
    current = parent;
  }
  return chain;
}

/**
 * The set of org-unit ids a user is allowed to see: their own unit plus every
 * unit beneath it. Users with no unit (or the state head) implicitly see all.
 */
export function getVisibleUnitIds(units: OrgUnit[], userOrgUnitId?: string | null): Set<string> {
  if (!userOrgUnitId || !getUnit(units, userOrgUnitId)) {
    return new Set(units.map((u) => u.id));
  }
  return new Set(getDescendantIds(units, userOrgUnitId));
}

export function staffInUnits(staff: StaffUser[], unitIds: Set<string>): StaffUser[] {
  return staff.filter((s) => s.orgUnitId && unitIds.has(s.orgUnitId));
}

export function projectsInUnits(projects: Project[], unitIds: Set<string>): Project[] {
  return projects.filter((p) => p.orgUnitId && unitIds.has(p.orgUnitId));
}

export function complaintsInUnits(
  complaints: Complaint[],
  projects: Project[],
  unitIds: Set<string>,
): Complaint[] {
  return complaints.filter((c) => {
    const p = projects.find((pr) => pr.id === c.projectId);
    return p?.orgUnitId && unitIds.has(p.orgUnitId);
  });
}

/** Complaints whose project maps to this exact org unit (not descendants). */
export function complaintsForUnit(
  complaints: Complaint[],
  projects: Project[],
  unitId: string,
): Complaint[] {
  return complaints.filter((c) => {
    const p = projects.find((pr) => pr.id === c.projectId);
    return p?.orgUnitId === unitId;
  });
}

/** Officers (subset) that head a given unit. */
export function headsOfUnit(staff: StaffUser[], unitId: string): StaffUser[] {
  return staff.filter((s) => s.orgUnitId === unitId);
}

export interface OrgTreeNode {
  unit: OrgUnit;
  children: OrgTreeNode[];
}

/** Build a nested tree limited to the units the user may see. */
export function buildVisibleTree(units: OrgUnit[], userOrgUnitId?: string | null): OrgTreeNode | null {
  const visible = getVisibleUnitIds(units, userOrgUnitId);
  const rootUnit =
    userOrgUnitId && getUnit(units, userOrgUnitId)
      ? getUnit(units, userOrgUnitId)!
      : units.find((u) => u.parentId === null);
  if (!rootUnit) return null;

  const build = (unit: OrgUnit): OrgTreeNode => ({
    unit,
    children: units
      .filter((u) => u.parentId === unit.id && visible.has(u.id))
      .map(build),
  });
  return build(rootUnit);
}

/** Haversine distance in metres between two lat/lng points. */
export function distanceMeters(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const lat1 = toRad(aLat);
  const lat2 = toRad(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Distance below which a field photo counts as "on-site". */
export const ON_SITE_RADIUS_M = 200;
