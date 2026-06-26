import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Camera, FolderKanban, Network, MapPin, Users } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useSession } from '@/hooks/useSession';
import { getUnit, levelLabels, projectsInUnits, staffInUnits } from '@/lib/hierarchy';
import { formatDate } from '@/lib/utils';

export default function AppHomePage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { projects, statusUpdates, orgUnits, staff: allStaff } = useStore();
  const { session, staff, visibleUnitIds } = useSession();

  const unit = getUnit(orgUnits, staff?.orgUnitId ?? session?.orgUnitId);
  const scopedProjects = projectsInUnits(projects, visibleUnitIds);
  const scopedStaff = staffInUnits(allStaff, visibleUnitIds);
  const fieldUpdates = statusUpdates
    .filter((u) => u.photoDataUrl && scopedProjects.some((p) => p.id === u.projectId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-5 p-4">
      <div>
        <p className="text-sm text-slate-500">{t('welcome')},</p>
        <h1 className="text-xl font-bold text-pwd-ink">{session?.name}</h1>
        <p className="text-sm text-slate-500">
          {session?.designation}
          {unit && <> · {levelLabels[unit.level][isHi ? 'hi' : 'en']}</>}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="card p-4">
          <FolderKanban className="h-5 w-5 text-pwd-green" />
          <div className="mt-2 text-2xl font-bold text-pwd-ink">{scopedProjects.length}</div>
          <div className="text-xs text-slate-500">{t('projectsInScope')}</div>
        </div>
        <div className="card p-4">
          <Users className="h-5 w-5 text-pwd-green" />
          <div className="mt-2 text-2xl font-bold text-pwd-ink">{scopedStaff.length}</div>
          <div className="text-xs text-slate-500">{t('officersInScope')}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/app/capture" className="flex flex-col gap-1 rounded-xl bg-pwd-green p-4 text-white shadow-sm">
          <Camera className="h-6 w-6" />
          <span className="mt-1 font-semibold">{t('captureProgress')}</span>
          <span className="text-xs text-white/80">{t('captureProgressHint')}</span>
        </Link>
        <Link to="/app/hierarchy" className="flex flex-col gap-1 rounded-xl bg-pwd-chakra p-4 text-white shadow-sm">
          <Network className="h-6 w-6" />
          <span className="mt-1 font-semibold">{t('hierarchy')}</span>
          <span className="text-xs text-white/80">{t('hierarchyHint')}</span>
        </Link>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold text-pwd-ink">{t('recentFieldUpdates')}</h2>
          <Link to="/app/projects" className="text-xs text-pwd-green">{t('viewAll')}</Link>
        </div>
        {fieldUpdates.length === 0 ? (
          <div className="card text-center text-sm text-slate-500">{t('noFieldUpdates')}</div>
        ) : (
          <div className="space-y-3">
            {fieldUpdates.map((u) => {
              const project = projects.find((p) => p.id === u.projectId);
              return (
                <Link key={u.id} to={`/app/projects/${u.projectId}`} className="card flex gap-3 p-3">
                  {u.photoDataUrl && (
                    <img src={u.photoDataUrl} alt="" className="h-16 w-16 flex-shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-pwd-ink">
                      {project ? (isHi ? project.nameHi : project.name) : u.projectId}
                    </p>
                    <p className="truncate text-xs text-slate-500">{isHi ? u.messageHi : u.message}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-xs font-semibold text-pwd-green">{u.completionPercent}%</span>
                      {u.onSite && (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] text-green-700">
                          <MapPin className="h-3 w-3" /> {t('onSite')}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">{formatDate(u.createdAt, i18n.language)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
