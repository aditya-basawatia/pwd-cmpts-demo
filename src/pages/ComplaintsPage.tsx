import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { useInternalScope } from '@/hooks/useInternalScope';
import { getUnit, levelLabels } from '@/lib/hierarchy';
import { isOverdue } from '@/lib/utils';
import { StatusBadge } from '@/components/Badges';
import ViewModeToggle, { type DataViewMode } from '@/components/ViewModeToggle';
import HierarchyComplaintsTree from '@/components/HierarchyComplaintsTree';

export default function ComplaintsPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { session, scopedComplaints, scopedProjects, tree, orgUnits, orgUnitId } = useInternalScope();
  const [mode, setMode] = useState<DataViewMode>('hierarchy');

  const unit = getUnit(orgUnits, orgUnitId);

  if (!session) return null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pwd-navy">{t('complaints')}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 text-pwd-green" />
            {unit
              ? `${levelLabels[unit.level][isHi ? 'hi' : 'en']}: ${isHi ? unit.nameHi : unit.name}`
              : t('fullStateAccess')}
            {' · '}
            {scopedComplaints.length} {t('inYourScope')}
          </p>
        </div>
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === 'hierarchy' && tree ? (
        <HierarchyComplaintsTree
          tree={tree}
          complaints={scopedComplaints}
          projects={scopedProjects}
          orgUnits={orgUnits}
        />
      ) : mode === 'hierarchy' ? (
        <div className="card text-center text-sm text-slate-500">{t('noResults')}</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-3 pr-4">Ticket ID</th>
                <th className="pb-3 pr-4">{t('hierarchy')}</th>
                <th className="pb-3 pr-4">Description</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Priority</th>
                <th className="pb-3">SLA</th>
              </tr>
            </thead>
            <tbody>
              {scopedComplaints.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">{t('noResults')}</td>
                </tr>
              ) : (
                scopedComplaints.map((c) => {
                  const project = scopedProjects.find((p) => p.id === c.projectId);
                  const org = project?.orgUnitId ? getUnit(orgUnits, project.orgUnitId) : undefined;
                  return (
                    <tr
                      key={c.id}
                      className={`border-b last:border-0 ${isOverdue(c.slaDueAt, c.status) ? 'bg-red-50' : ''}`}
                    >
                      <td className="py-3 pr-4">
                        <Link
                          to={`/internal/complaints/${c.id}`}
                          className="font-mono font-medium text-pwd-navy hover:underline"
                        >
                          {c.ticketId}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 max-w-[10rem] truncate text-xs text-slate-500">
                        {org ? (isHi ? org.nameHi : org.name) : '—'}
                      </td>
                      <td className="py-3 pr-4 max-w-xs truncate">{c.description}</td>
                      <td className="py-3 pr-4"><StatusBadge status={c.status} /></td>
                      <td className="py-3 pr-4 capitalize">{c.priority}</td>
                      <td className="py-3 text-xs">
                        {isOverdue(c.slaDueAt, c.status) ? (
                          <span className="font-medium text-red-600">OVERDUE</span>
                        ) : (
                          new Date(c.slaDueAt).toLocaleDateString()
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
