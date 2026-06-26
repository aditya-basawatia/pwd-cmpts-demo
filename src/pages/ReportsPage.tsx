import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, ShieldCheck } from 'lucide-react';
import { useInternalScope } from '@/hooks/useInternalScope';
import { getUnit, levelLabels } from '@/lib/hierarchy';
import { exportCsv, isOverdue } from '@/lib/utils';
import ViewModeToggle, { type DataViewMode } from '@/components/ViewModeToggle';
import HierarchyReportsTree from '@/components/HierarchyReportsTree';

export default function ReportsPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { scopedComplaints, scopedProjects, tree, orgUnits, orgUnitId } = useInternalScope();
  const [mode, setMode] = useState<DataViewMode>('hierarchy');

  const unit = getUnit(orgUnits, orgUnitId);
  const overdueCount = scopedComplaints.filter((c) => isOverdue(c.slaDueAt, c.status)).length;
  const resolvedCount = scopedComplaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;

  const exportComplaints = () => {
    exportCsv(
      'cmpts-complaints.csv',
      ['Ticket ID', 'Status', 'Priority', 'Org Unit', 'Description', 'SLA Due', 'Overdue'],
      scopedComplaints.map((c) => {
        const p = scopedProjects.find((pr) => pr.id === c.projectId);
        const org = p?.orgUnitId ? orgUnits.find((u) => u.id === p.orgUnitId) : undefined;
        return [
          c.ticketId,
          c.status,
          c.priority,
          org?.name || '',
          c.description.slice(0, 100),
          new Date(c.slaDueAt).toLocaleDateString(),
          isOverdue(c.slaDueAt, c.status) ? 'YES' : 'NO',
        ];
      }),
    );
  };

  const exportProjects = () => {
    exportCsv(
      'cmpts-projects.csv',
      ['ID', 'Name', 'Type', 'Org Unit', 'Status', 'Completion %', 'Work Order'],
      scopedProjects.map((p) => [
        p.id,
        p.name,
        p.type,
        orgUnits.find((u) => u.id === p.orgUnitId)?.name || '',
        p.status,
        String(p.completionPercent),
        p.workOrderRef || '',
      ]),
    );
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pwd-navy">{t('reports')}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 text-pwd-green" />
            {unit
              ? `${levelLabels[unit.level][isHi ? 'hi' : 'en']}: ${isHi ? unit.nameHi : unit.name}`
              : t('fullStateAccess')}
            {' · '}
            {t('inYourScope')}
          </p>
        </div>
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <div className="text-3xl font-bold text-pwd-navy">{scopedComplaints.length}</div>
          <div className="text-sm text-slate-500">{t('totalComplaints')}</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{resolvedCount}</div>
          <div className="text-sm text-slate-500">Resolved / Closed</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-600">{overdueCount}</div>
          <div className="text-sm text-slate-500">{t('overdue')}</div>
        </div>
      </div>

      {mode === 'hierarchy' && tree ? (
        <HierarchyReportsTree
          tree={tree}
          complaints={scopedComplaints}
          projects={scopedProjects}
          orgUnits={orgUnits}
        />
      ) : mode === 'hierarchy' ? (
        <div className="card mb-8 text-center text-sm text-slate-500">{t('noResults')}</div>
      ) : (
        <div className="card mb-8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-3 pr-4">{t('hierarchy')}</th>
                <th className="pb-3 pr-4">{t('projects')}</th>
                <th className="pb-3 pr-4">{t('complaints')}</th>
                <th className="pb-3 pr-4">{t('overdue')}</th>
                <th className="pb-3">{t('progress')}</th>
              </tr>
            </thead>
            <tbody>
              {orgUnits
                .filter((u) => scopedProjects.some((p) => p.orgUnitId === u.id) || scopedComplaints.some((c) => {
                  const p = scopedProjects.find((pr) => pr.id === c.projectId);
                  return p?.orgUnitId === u.id;
                }))
                .map((u) => {
                  const uProjects = scopedProjects.filter((p) => p.orgUnitId === u.id);
                  const uComplaints = scopedComplaints.filter((c) => {
                    const p = scopedProjects.find((pr) => pr.id === c.projectId);
                    return p?.orgUnitId === u.id;
                  });
                  const overdue = uComplaints.filter((c) => isOverdue(c.slaDueAt, c.status)).length;
                  const avg =
                    uProjects.length > 0
                      ? Math.round(uProjects.reduce((s, p) => s + p.completionPercent, 0) / uProjects.length)
                      : 0;
                  return (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-pwd-ink">{isHi ? u.nameHi : u.name}</div>
                        <div className="text-xs text-slate-400">{levelLabels[u.level][isHi ? 'hi' : 'en']}</div>
                      </td>
                      <td className="py-3 pr-4">{uProjects.length}</td>
                      <td className="py-3 pr-4">{uComplaints.length}</td>
                      <td className="py-3 pr-4 text-red-600">{overdue}</td>
                      <td className="py-3">{avg}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={exportComplaints} className="card flex items-center gap-3 text-left transition hover:shadow-md">
          <Download className="h-8 w-8 text-pwd-navy" />
          <div>
            <p className="font-semibold">{t('exportCsv')} — Complaints</p>
            <p className="text-sm text-slate-500">{scopedComplaints.length} records</p>
          </div>
        </button>
        <button onClick={exportProjects} className="card flex items-center gap-3 text-left transition hover:shadow-md">
          <Download className="h-8 w-8 text-pwd-navy" />
          <div>
            <p className="font-semibold">{t('exportCsv')} — Projects</p>
            <p className="text-sm text-slate-500">{scopedProjects.length} records</p>
          </div>
        </button>
      </div>
    </div>
  );
}
