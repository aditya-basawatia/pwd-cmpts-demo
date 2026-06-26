import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ProgressBar, ProjectStatusBadge } from '@/components/Badges';
import ProgressPhoto from '@/components/ProgressPhoto';
import { formatDate } from '@/lib/utils';

export default function AppProjectDetailPage() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { projects, statusUpdates } = useStore();
  const project = projects.find((p) => p.id === id);

  const updates = statusUpdates
    .filter((u) => u.projectId === id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!project) return <div className="p-8 text-center text-sm text-slate-500">{t('projectNotFound')}</div>;

  return (
    <div className="space-y-4 p-4">
      <Link to="/app/projects" className="inline-flex items-center text-sm text-slate-500">
        <ArrowLeft className="mr-1 h-4 w-4" /> {t('back')}
      </Link>

      <div className="card">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-lg font-bold text-pwd-ink">{isHi ? project.nameHi : project.name}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        <p className="mt-1 text-xs text-slate-500">{isHi ? project.locationHi : project.location}</p>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-slate-500">{t('progress')}</span>
          <span className="font-bold text-pwd-ink">{project.completionPercent}%</span>
        </div>
        <div className="mt-1"><ProgressBar percent={project.completionPercent} /></div>
        {project.contractor && (
          <p className="mt-3 text-xs text-slate-500">{t('contractor')}: {project.contractor}</p>
        )}
      </div>

      <Link to={`/app/capture?project=${project.id}`} className="btn-primary w-full">
        <Camera className="mr-2 h-4 w-4" /> {t('captureProgress')}
      </Link>

      <div>
        <h2 className="mb-2 font-semibold text-pwd-ink">{t('statusUpdates')}</h2>
        {updates.length === 0 ? (
          <div className="card text-center text-sm text-slate-500">{t('noUpdatesYet')}</div>
        ) : (
          <div className="space-y-3">
            {updates.map((u) => (
              <div key={u.id} className="card p-3">
                <ProgressPhoto src={u.photoDataUrl} className="mb-2 h-44 w-full rounded-lg" />
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-pwd-ink">{isHi ? u.messageHi : u.message}</p>
                  <span className="flex-shrink-0 text-sm font-bold text-pwd-green">{u.completionPercent}%</span>
                </div>
                {u.milestoneLabel && (
                  <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px]">{u.milestoneLabel}</span>
                )}
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  {u.createdByName && <span>{u.createdByName}</span>}
                  <span>{formatDate(u.createdAt, i18n.language)}</span>
                  {u.onSite != null && (
                    <span className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 ${u.onSite ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      <MapPin className="h-3 w-3" />
                      {u.onSite ? t('onSite') : t('offSite')}
                      {u.distanceM != null && ` · ${u.distanceM}m`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
