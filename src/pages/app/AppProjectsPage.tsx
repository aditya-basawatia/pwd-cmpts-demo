import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useSession } from '@/hooks/useSession';
import { ProgressBar, ProjectStatusBadge, TypeIcon } from '@/components/Badges';
import { projectsInUnits } from '@/lib/hierarchy';

export default function AppProjectsPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { projects } = useStore();
  const { visibleUnitIds } = useSession();
  const scoped = projectsInUnits(projects, visibleUnitIds);

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-lg font-bold text-pwd-ink">{t('projects')}</h1>
        <p className="text-xs text-slate-500">{t('projectsScopeNote')}</p>
      </div>
      {scoped.length === 0 ? (
        <div className="card text-center text-sm text-slate-500">{t('noResults')}</div>
      ) : (
        <div className="space-y-3">
          {scoped.map((p) => (
            <Link key={p.id} to={`/app/projects/${p.id}`} className="card block p-4">
              <div className="flex items-start gap-3">
                <TypeIcon type={p.type} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-pwd-ink">{isHi ? p.nameHi : p.name}</p>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-slate-300" />
                  </div>
                  <p className="truncate text-xs text-slate-500">{isHi ? p.locationHi : p.location}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <ProjectStatusBadge status={p.status} />
                    <span className="text-xs font-semibold text-pwd-green">{p.completionPercent}%</span>
                  </div>
                  <div className="mt-2"><ProgressBar percent={p.completionPercent} /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
