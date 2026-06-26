import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ProgressBar, ProjectStatusBadge } from '@/components/Badges';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const { projects, divisions, statusUpdates } = useStore();
  const isHi = i18n.language === 'hi';
  const project = projects.find((p) => p.id === id);
  const div = project ? divisions.find((d) => d.id === project.divisionId) : null;
  const updates = statusUpdates
    .filter((u) => u.projectId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!project) return <div className="p-8 text-center">Project not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/projects" className="inline-flex items-center text-sm text-pwd-navy mb-4 hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" /> {t('back')}
      </Link>

      <div className="card mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-pwd-navy">{isHi ? project.nameHi : project.name}</h1>
            <p className="text-slate-500 mt-1">{isHi ? div?.nameHi : div?.name} · {isHi ? project.locationHi : project.location}</p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>{t('progress')}</span>
            <span className="font-semibold">{project.completionPercent}%</span>
          </div>
          <ProgressBar percent={project.completionPercent} />
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          {project.contractor && <div><span className="text-slate-500">{t('contractor')}:</span> {project.contractor}</div>}
          {project.workOrderRef && <div><span className="text-slate-500">{t('workOrder')}:</span> {project.workOrderRef}</div>}
          {project.sanctionedValue && <div><span className="text-slate-500">{t('sanctionedValue')}:</span> {formatCurrency(project.sanctionedValue)}</div>}
          {project.expectedCompletion && <div><span className="text-slate-500">{t('expectedCompletion')}:</span> {project.expectedCompletion}</div>}
          {project.autoCreated && <div className="text-pwd-green font-medium">{t('autoCreated')}</div>}
        </div>

        {project.description && <p className="mt-4 text-sm text-slate-600">{project.description}</p>}

        <Link to={`/lodge?project=${project.id}`} className="btn-primary mt-6 inline-flex">
          <MessageSquarePlus className="mr-2 h-4 w-4" /> {t('lodgeComplaint')}
        </Link>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-pwd-navy mb-4">{t('statusUpdates')}</h2>
        {updates.length === 0 ? (
          <p className="text-slate-500 text-sm">No updates yet.</p>
        ) : (
          <div className="space-y-4">
            {updates.map((u) => (
              <div key={u.id} className="flex gap-4 border-l-4 border-pwd-gold pl-4">
                <div className="flex-1">
                  <p className="font-medium">{isHi ? u.messageHi : u.message}</p>
                  {u.milestoneLabel && <span className="text-xs bg-slate-100 rounded px-2 py-0.5 mt-1 inline-block">{u.milestoneLabel}</span>}
                  <p className="text-xs text-slate-500 mt-1">{formatDate(u.createdAt, i18n.language)}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-pwd-navy">{u.completionPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
