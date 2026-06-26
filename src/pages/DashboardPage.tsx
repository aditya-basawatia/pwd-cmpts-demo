import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock, FolderKanban, MessageSquareWarning } from 'lucide-react';
import { useInternalScope } from '@/hooks/useInternalScope';
import { isOverdue } from '@/lib/utils';
import { StatusBadge } from '@/components/Badges';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { session, scopedComplaints, scopedProjects } = useInternalScope();

  if (!session) return null;

  const newComplaints = scopedComplaints.filter((c) => c.status === 'submitted');
  const assigned = scopedComplaints.filter(
    (c) => c.assignedToId === session.id && !['resolved', 'closed'].includes(c.status),
  );
  const overdueList = scopedComplaints.filter((c) => isOverdue(c.slaDueAt, c.status));

  const stats = [
    { label: t('totalProjects'), value: scopedProjects.length, icon: FolderKanban, color: 'text-blue-600' },
    { label: t('newComplaints'), value: newComplaints.length, icon: MessageSquareWarning, color: 'text-orange-600' },
    { label: t('assignedToMe'), value: assigned.length, icon: Clock, color: 'text-purple-600' },
    { label: t('overdue'), value: overdueList.length, icon: AlertTriangle, color: 'text-red-600' },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-pwd-navy">{t('welcome')}, {session.name}</h1>
      <p className="mb-6 text-slate-500">Dashboard overview</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`rounded-lg bg-slate-100 p-3 ${s.color}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {overdueList.length > 0 && (
        <div className="card mb-6 border-red-200 bg-red-50">
          <h2 className="mb-3 flex items-center gap-2 font-semibold text-red-800">
            <AlertTriangle className="h-5 w-5" /> {t('overdue')} Complaints
          </h2>
          <div className="space-y-2">
            {overdueList.map((c) => (
              <Link
                key={c.id}
                to={`/internal/complaints/${c.id}`}
                className="flex items-center justify-between rounded-lg bg-white p-3 text-sm hover:shadow"
              >
                <span className="font-mono font-medium">{c.ticketId}</span>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="mb-3 font-semibold text-pwd-navy">{t('newComplaints')}</h2>
        {newComplaints.length === 0 ? (
          <p className="text-sm text-slate-500">No new complaints.</p>
        ) : (
          <div className="space-y-2">
            {newComplaints.map((c) => (
              <Link
                key={c.id}
                to={`/internal/complaints/${c.id}`}
                className="flex items-center justify-between rounded-lg border p-3 text-sm hover:bg-slate-50"
              >
                <div>
                  <span className="font-mono font-medium">{c.ticketId}</span>
                  <p className="mt-0.5 text-xs text-slate-500">{c.description.slice(0, 80)}...</p>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
