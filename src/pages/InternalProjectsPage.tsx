import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useInternalScope } from '@/hooks/useInternalScope';
import { updateState, generateId, addAuditLog } from '@/store/store';
import { canEditProjects } from '@/lib/rbac';
import { getUnit, levelLabels } from '@/lib/hierarchy';
import { ProgressBar, ProjectStatusBadge } from '@/components/Badges';
import ViewModeToggle, { type DataViewMode } from '@/components/ViewModeToggle';
import HierarchyProjectsTree from '@/components/HierarchyProjectsTree';
import ProgressPhoto from '@/components/ProgressPhoto';
import { formatDate } from '@/lib/utils';

export default function InternalProjectsPage() {
  const { t, i18n } = useTranslation();
  const { session, scopedProjects, tree, orgUnits, orgUnitId } = useInternalScope();
  const { statusUpdates } = useStore();
  const isHi = i18n.language === 'hi';
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState<DataViewMode>('hierarchy');
  const [updateForm, setUpdateForm] = useState({ message: '', messageHi: '', percent: 0, milestone: '' });

  if (!session) return null;

  const visible = scopedProjects;
  const selected = visible.find((p) => p.id === selectedId);
  const scopeUnit = getUnit(orgUnits, orgUnitId);
  const updates = statusUpdates
    .filter((u) => u.projectId === selectedId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const postUpdate = () => {
    if (!selected || !canEditProjects(session.role)) return;
    const now = new Date().toISOString();
    updateState((s) => ({
      ...s,
      projects: s.projects.map((p) =>
        p.id === selected.id ? { ...p, completionPercent: updateForm.percent } : p,
      ),
      statusUpdates: [
        {
          id: generateId('su'),
          projectId: selected.id,
          message: updateForm.message,
          messageHi: updateForm.messageHi || updateForm.message,
          completionPercent: updateForm.percent,
          milestoneLabel: updateForm.milestone || undefined,
          createdAt: now,
          createdBy: session.id,
          createdByName: session.name,
        },
        ...s.statusUpdates,
      ],
    }));
    addAuditLog('STATUS_UPDATE', 'project', selected.id, session.id, session.name, `${updateForm.percent}% - ${updateForm.message}`);
    setUpdateForm({ message: '', messageHi: '', percent: 0, milestone: '' });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pwd-navy">{t('projects')}</h1>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <ShieldCheck className="h-4 w-4 text-pwd-green" />
            {scopeUnit
              ? `${levelLabels[scopeUnit.level][isHi ? 'hi' : 'en']}: ${isHi ? scopeUnit.nameHi : scopeUnit.name}`
              : t('fullStateAccess')}
            {' · '}
            {visible.length} {t('inYourScope')}
          </p>
        </div>
        <ViewModeToggle mode={mode} onChange={setMode} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {mode === 'hierarchy' && tree ? (
          <HierarchyProjectsTree
            tree={tree}
            projects={visible}
            orgUnits={orgUnits}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <div className="card max-h-[600px] space-y-2 overflow-y-auto">
            {visible.map((p) => {
              const unit = getUnit(orgUnits, p.orgUnitId);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${selectedId === p.id ? 'border-pwd-navy bg-pwd-navy/5' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium">{isHi ? p.nameHi : p.name}</span>
                    <ProjectStatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-500">{unit ? (isHi ? unit.nameHi : unit.name) : '—'}</p>
                  <ProgressBar percent={p.completionPercent} />
                </button>
              );
            })}
          </div>
        )}

        {selected ? (
          <div className="space-y-4">
            <div className="card">
              <h2 className="mb-2 font-semibold">{isHi ? selected.nameHi : selected.name}</h2>
              <ProgressBar percent={selected.completionPercent} />
              <p className="mt-2 text-sm text-slate-500">{selected.completionPercent}% complete</p>
              {selected.workOrderRef && <p className="mt-1 text-xs">{selected.workOrderRef}</p>}
            </div>

            <div className="card">
              <h3 className="mb-3 font-semibold">{t('statusUpdates')}</h3>
              {updates.length === 0 ? (
                <p className="text-sm text-slate-500">{t('noUpdatesYet')}</p>
              ) : (
                <div className="space-y-4">
                  {updates.map((u) => (
                    <div key={u.id} className="flex gap-3 border-l-2 border-pwd-gold pl-3">
                      <ProgressPhoto src={u.photoDataUrl} className="h-20 w-20 flex-shrink-0 rounded-lg" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{isHi ? u.messageHi : u.message}</p>
                        {u.milestoneLabel && (
                          <span className="mt-0.5 inline-block rounded bg-slate-100 px-2 py-0.5 text-[11px]">{u.milestoneLabel}</span>
                        )}
                        <p className="mt-1 text-xs text-slate-400">
                          {u.completionPercent}% · {formatDate(u.createdAt, i18n.language)}
                          {u.createdByName && ` · ${u.createdByName}`}
                        </p>
                        {u.onSite != null && (
                          <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] ${u.onSite ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
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

            {canEditProjects(session.role) && (
              <div className="card space-y-3">
                <h3 className="font-semibold">{t('postUpdate')}</h3>
                <input className="input" placeholder={t('updateMessage')} value={updateForm.message} onChange={(e) => setUpdateForm({ ...updateForm, message: e.target.value })} />
                <input className="input" placeholder="Hindi message" value={updateForm.messageHi} onChange={(e) => setUpdateForm({ ...updateForm, messageHi: e.target.value })} />
                <input className="input" placeholder={t('milestones')} value={updateForm.milestone} onChange={(e) => setUpdateForm({ ...updateForm, milestone: e.target.value })} />
                <input className="input" type="number" min={0} max={100} placeholder={t('completionPercent')} value={updateForm.percent} onChange={(e) => setUpdateForm({ ...updateForm, percent: +e.target.value })} />
                <button className="btn-primary w-full" onClick={postUpdate}>{t('save')}</button>
              </div>
            )}
          </div>
        ) : (
          <div className="card flex h-48 items-center justify-center text-slate-400">{t('selectAProject')}</div>
        )}
      </div>
    </div>
  );
}
