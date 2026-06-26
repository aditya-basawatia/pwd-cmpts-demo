import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { getSession, updateState, generateId, addAuditLog, addNotification } from '@/store/store';
import { canAssignComplaints, canHandleComplaints, isReadOnly } from '@/lib/rbac';
import { StatusBadge } from '@/components/Badges';
import { complaintStatusFlow, formatDate } from '@/lib/utils';
import type { ComplaintStatus } from '@/types';

export default function ComplaintDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const session = getSession()!;
  const { complaints, complaintEvents, staff, projects } = useStore();
  const complaint = complaints.find((c) => c.id === id);
  const events = complaintEvents.filter((e) => e.complaintId === id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const project = complaint ? projects.find((p) => p.id === complaint.projectId) : null;
  const handlers = staff.filter((s) => s.role === 'complaint_handler' && s.active);

  const [newStatus, setNewStatus] = useState<ComplaintStatus>('acknowledged');
  const [note, setNote] = useState('');
  const [publicRemark, setPublicRemark] = useState('');
  const [assignTo, setAssignTo] = useState('');

  if (!complaint) return <div className="p-8">Complaint not found</div>;

  const readonly = isReadOnly(session.role);
  const currentIdx = complaintStatusFlow.indexOf(complaint.status);
  const nextStatuses = complaintStatusFlow.slice(currentIdx + 1, currentIdx + 3);

  const updateComplaint = (status: ComplaintStatus, extra?: Partial<typeof complaint>) => {
    const now = new Date().toISOString();
    updateState((s) => ({
      ...s,
      complaints: s.complaints.map((c) =>
        c.id === complaint.id
          ? {
              ...c,
              status,
              updatedAt: now,
              assignedToId: assignTo || c.assignedToId,
              publicRemarks: publicRemark ? [...c.publicRemarks, publicRemark] : c.publicRemarks,
              ...extra,
            }
          : c,
      ),
      complaintEvents: [
        ...s.complaintEvents,
        {
          id: generateId('ce'),
          complaintId: complaint.id,
          status,
          note,
          publicRemark: publicRemark || undefined,
          createdAt: now,
          createdBy: session.id,
          createdByName: session.name,
        },
      ],
    }));
    addAuditLog('STATUS_CHANGE', 'complaint', complaint.id, session.id, session.name, `${complaint.status} → ${status}`);
    addNotification('sms', complaint.citizenMobile, `Your complaint ${complaint.ticketId} status updated to: ${status}`);
    setNote('');
    setPublicRemark('');
  };

  return (
    <div>
      <Link to="/internal/complaints" className="inline-flex items-center text-sm text-pwd-navy mb-4 hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" /> {t('back')}
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-mono text-xl font-bold">{complaint.ticketId}</h1>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-sm text-slate-500 mb-2">Project: {project?.name}</p>
            <p className="mb-4">{complaint.description}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-slate-500">Citizen:</span> {complaint.citizenName}</div>
              <div><span className="text-slate-500">Mobile:</span> {complaint.citizenMobile}</div>
              <div><span className="text-slate-500">Location:</span> {complaint.location}</div>
              <div><span className="text-slate-500">Priority:</span> <span className="capitalize">{complaint.priority}</span></div>
            </div>
          </div>

          <div className="card">
            <h2 className="font-semibold mb-4">Timeline</h2>
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="flex gap-3 border-l-2 border-pwd-gold pl-4">
                  <div>
                    <p className="font-medium text-sm capitalize">{e.status.replace(/_/g, ' ')}</p>
                    {e.note && <p className="text-sm text-slate-600">{e.note}</p>}
                    {e.publicRemark && <p className="text-sm text-green-700 bg-green-50 rounded p-1 mt-1">{e.publicRemark}</p>}
                    <p className="text-xs text-slate-400">{formatDate(e.createdAt)} · {e.createdByName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {!readonly && canHandleComplaints(session.role) && (
          <div className="card space-y-4 h-fit">
            <h2 className="font-semibold">{t('updateStatus')}</h2>

            {canAssignComplaints(session.role) && complaint.status !== 'resolved' && (
              <div>
                <label className="label">{t('assign')}</label>
                <select className="input" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                  <option value="">-- Select Handler --</option>
                  {handlers.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="label">New Status</label>
              <select className="input" value={newStatus} onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}>
                {nextStatuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                {complaint.status === 'resolved' && <option value="reopened">reopened</option>}
              </select>
            </div>
            <div>
              <label className="label">{t('internalNote')}</label>
              <textarea className="input" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <div>
              <label className="label">{t('publicRemark')}</label>
              <textarea className="input" value={publicRemark} onChange={(e) => setPublicRemark(e.target.value)} />
            </div>
            <button
              className="btn-primary w-full"
              onClick={() => updateComplaint(newStatus, assignTo ? { assignedToId: assignTo } : undefined)}
            >
              {t('save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
