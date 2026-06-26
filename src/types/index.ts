export type ProjectType = 'building' | 'road' | 'bridge' | 'other';
export type ProjectStatus = 'in_progress' | 'completed' | 'planned';
export type ComplaintStatus =
  | 'submitted'
  | 'acknowledged'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'closed'
  | 'reopened';
export type ComplaintPriority = 'low' | 'medium' | 'high' | 'urgent';
export type StaffRole =
  | 'super_admin'
  | 'dept_admin'
  | 'division_officer'
  | 'complaint_handler'
  | 'viewer';

// PWD administrative hierarchy levels, top (state) to bottom (sub-division).
export type OrgLevel = 'state' | 'zone' | 'circle' | 'division' | 'subdivision';

export interface OrgUnit {
  id: string;
  name: string;
  nameHi: string;
  level: OrgLevel;
  parentId: string | null;
  /** Geographic centre used by the field app (lat,lng) where relevant. */
  lat?: number;
  lng?: number;
}

export interface Division {
  id: string;
  name: string;
  nameHi: string;
}

export interface StatusUpdate {
  id: string;
  projectId: string;
  message: string;
  messageHi: string;
  completionPercent: number;
  milestoneLabel?: string;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
  /** Field-capture metadata (geo-tagged on-site progress photos). */
  photoDataUrl?: string;
  lat?: number;
  lng?: number;
  accuracyM?: number;
  distanceM?: number;
  onSite?: boolean;
}

export interface Project {
  id: string;
  name: string;
  nameHi: string;
  type: ProjectType;
  divisionId: string;
  /** Org unit (sub-division/division) that owns this project for hierarchy scoping. */
  orgUnitId?: string;
  location: string;
  locationHi: string;
  /** Work site coordinates used for on-site geo-verification in the field app. */
  lat?: number;
  lng?: number;
  status: ProjectStatus;
  completionPercent: number;
  contractor?: string;
  workOrderRef?: string;
  sanctionedValue?: number;
  expectedCompletion?: string;
  description?: string;
  autoCreated?: boolean;
  createdAt: string;
}

export interface ComplaintMedia {
  id: string;
  name: string;
  type: string;
  dataUrl: string;
}

export interface ComplaintEvent {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  note?: string;
  publicRemark?: string;
  createdAt: string;
  createdBy?: string;
  createdByName?: string;
}

export interface Complaint {
  id: string;
  ticketId: string;
  projectId: string;
  citizenName: string;
  citizenMobile: string;
  category: string;
  description: string;
  location: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  slaDueAt: string;
  assignedToId?: string;
  media: ComplaintMedia[];
  resolutionMedia: ComplaintMedia[];
  publicRemarks: string[];
  feedback?: { rating: number; comment: string };
  createdAt: string;
  updatedAt: string;
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  role: StaffRole;
  divisionIds: string[];
  /** The org unit this officer heads; drives hierarchy visibility scoping. */
  orgUnitId?: string;
  /** Demo accounts that bypass the on-site GPS check during field capture. */
  demoOverride?: boolean;
  password: string;
  active: boolean;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  userName?: string;
  details?: string;
  createdAt: string;
}

export interface NotificationLog {
  id: string;
  channel: 'sms' | 'email' | 'push';
  recipient: string;
  message: string;
  createdAt: string;
}

export interface ComplaintCategory {
  id: string;
  name: string;
  nameHi: string;
  slaDays: number;
}

export interface AppState {
  divisions: Division[];
  orgUnits: OrgUnit[];
  projects: Project[];
  statusUpdates: StatusUpdate[];
  complaints: Complaint[];
  complaintEvents: ComplaintEvent[];
  staff: StaffUser[];
  categories: ComplaintCategory[];
  auditLogs: AuditLogEntry[];
  notifications: NotificationLog[];
}

export interface SessionUser {
  id: string;
  name: string;
  role: StaffRole;
  divisionIds: string[];
  orgUnitId?: string;
  designation?: string;
  demoOverride?: boolean;
}
