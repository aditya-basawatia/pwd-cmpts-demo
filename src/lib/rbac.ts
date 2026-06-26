import type { StaffRole } from '@/types';

export const roleLabels: Record<StaffRole, { en: string; hi: string }> = {
  super_admin: { en: 'Super Administrator', hi: 'मुख्य प्रशासक' },
  dept_admin: { en: 'Department Admin', hi: 'विभाग प्रशासक' },
  division_officer: { en: 'Division Officer', hi: 'मंडल अधिकारी' },
  complaint_handler: { en: 'Complaint Handler', hi: 'शिकायत प्रबंधक' },
  viewer: { en: 'Viewer / Auditor', hi: 'दर्शक / लेखापरीक्षक' },
};

export function canManageUsers(role: StaffRole) {
  return role === 'super_admin';
}

export function canManageAllDivisions(role: StaffRole) {
  return role === 'super_admin' || role === 'dept_admin' || role === 'viewer';
}

export function canEditProjects(role: StaffRole) {
  return ['super_admin', 'dept_admin', 'division_officer'].includes(role);
}

export function canHandleComplaints(role: StaffRole) {
  return ['super_admin', 'dept_admin', 'division_officer', 'complaint_handler'].includes(role);
}

export function canAssignComplaints(role: StaffRole) {
  return ['super_admin', 'dept_admin', 'division_officer'].includes(role);
}

export function isReadOnly(role: StaffRole) {
  return role === 'viewer';
}

export function hasDivisionAccess(role: StaffRole, userDivisions: string[], divisionId: string) {
  if (canManageAllDivisions(role)) return true;
  return userDivisions.includes(divisionId);
}
