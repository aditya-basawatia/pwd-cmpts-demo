import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/useStore';
import { getSession } from '@/store/store';
import { hasDivisionAccess } from '@/lib/rbac';
import { isOverdue } from '@/lib/utils';
import { StatusBadge } from '@/components/Badges';

export default function ComplaintsPage() {
  const { t } = useTranslation();
  const session = getSession()!;
  const { complaints, projects } = useStore();

  const visible = complaints.filter((c) => {
    const p = projects.find((pr) => pr.id === c.projectId);
    return p && hasDivisionAccess(session.role, session.divisionIds, p.divisionId);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('complaints')}</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-3 pr-4">Ticket ID</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Priority</th>
              <th className="pb-3">SLA</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((c) => (
              <tr key={c.id} className={`border-b last:border-0 ${isOverdue(c.slaDueAt, c.status) ? 'bg-red-50' : ''}`}>
                <td className="py-3 pr-4">
                  <Link to={`/internal/complaints/${c.id}`} className="font-mono font-medium text-pwd-navy hover:underline">
                    {c.ticketId}
                  </Link>
                </td>
                <td className="py-3 pr-4 max-w-xs truncate">{c.description}</td>
                <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                <td className="py-3 pr-4 capitalize">{c.priority}</td>
                <td className="py-3 text-xs">
                  {isOverdue(c.slaDueAt, c.status) ? (
                    <span className="text-red-600 font-medium">OVERDUE</span>
                  ) : (
                    new Date(c.slaDueAt).toLocaleDateString()
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
