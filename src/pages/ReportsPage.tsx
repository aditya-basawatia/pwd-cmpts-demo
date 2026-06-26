import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { exportCsv, isOverdue } from '@/lib/utils';

export default function ReportsPage() {
  const { t } = useTranslation();
  const { complaints, projects, divisions } = useStore();

  const exportComplaints = () => {
    exportCsv(
      'cmpts-complaints.csv',
      ['Ticket ID', 'Status', 'Priority', 'Division', 'Description', 'SLA Due', 'Overdue'],
      complaints.map((c) => {
        const p = projects.find((pr) => pr.id === c.projectId);
        const div = p ? divisions.find((d) => d.id === p.divisionId)?.name : '';
        return [
          c.ticketId,
          c.status,
          c.priority,
          div || '',
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
      ['ID', 'Name', 'Type', 'Division', 'Status', 'Completion %', 'Work Order'],
      projects.map((p) => [
        p.id,
        p.name,
        p.type,
        divisions.find((d) => d.id === p.divisionId)?.name || '',
        p.status,
        String(p.completionPercent),
        p.workOrderRef || '',
      ]),
    );
  };

  const overdueCount = complaints.filter((c) => isOverdue(c.slaDueAt, c.status)).length;
  const resolvedCount = complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('reports')}</h1>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="card text-center">
          <div className="text-3xl font-bold text-pwd-navy">{complaints.length}</div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <button onClick={exportComplaints} className="card flex items-center gap-3 hover:shadow-md transition text-left">
          <Download className="h-8 w-8 text-pwd-navy" />
          <div>
            <p className="font-semibold">{t('exportCsv')} — Complaints</p>
            <p className="text-sm text-slate-500">{complaints.length} records</p>
          </div>
        </button>
        <button onClick={exportProjects} className="card flex items-center gap-3 hover:shadow-md transition text-left">
          <Download className="h-8 w-8 text-pwd-navy" />
          <div>
            <p className="font-semibold">{t('exportCsv')} — Projects</p>
            <p className="text-sm text-slate-500">{projects.length} records</p>
          </div>
        </button>
      </div>
    </div>
  );
}
