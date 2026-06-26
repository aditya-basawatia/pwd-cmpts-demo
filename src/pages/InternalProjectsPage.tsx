import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/useStore';
import { getSession, updateState, generateId, addAuditLog } from '@/store/store';
import { canEditProjects, hasDivisionAccess } from '@/lib/rbac';
import { ProgressBar, ProjectStatusBadge } from '@/components/Badges';

export default function InternalProjectsPage() {
  const { t, i18n } = useTranslation();
  const session = getSession()!;
  const { projects, divisions, statusUpdates } = useStore();
  const isHi = i18n.language === 'hi';
  const [selectedId, setSelectedId] = useState('');
  const [updateForm, setUpdateForm] = useState({ message: '', messageHi: '', percent: 0, milestone: '' });

  const visible = projects.filter((p) => hasDivisionAccess(session.role, session.divisionIds, p.divisionId));
  const selected = projects.find((p) => p.id === selectedId);
  const updates = statusUpdates.filter((u) => u.projectId === selectedId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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
        },
        ...s.statusUpdates,
      ],
    }));
    addAuditLog('STATUS_UPDATE', 'project', selected.id, session.id, session.name, `${updateForm.percent}% - ${updateForm.message}`);
    setUpdateForm({ message: '', messageHi: '', percent: 0, milestone: '' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('projects')}</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-2 max-h-[600px] overflow-y-auto">
          {visible.map((p) => {
            const div = divisions.find((d) => d.id === p.divisionId);
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left rounded-lg border p-3 transition ${selectedId === p.id ? 'border-pwd-navy bg-pwd-navy/5' : 'hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm">{isHi ? p.nameHi : p.name}</span>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <p className="text-xs text-slate-500">{isHi ? div?.nameHi : div?.name}</p>
                <ProgressBar percent={p.completionPercent} />
              </button>
            );
          })}
        </div>

        {selected ? (
          <div className="space-y-4">
            <div className="card">
              <h2 className="font-semibold mb-2">{isHi ? selected.nameHi : selected.name}</h2>
              <ProgressBar percent={selected.completionPercent} />
              <p className="text-sm text-slate-500 mt-2">{selected.completionPercent}% complete</p>
              {selected.workOrderRef && <p className="text-xs mt-1">{selected.workOrderRef}</p>}
            </div>

            <div className="card">
              <h3 className="font-semibold mb-3">{t('statusUpdates')}</h3>
              {updates.map((u) => (
                <div key={u.id} className="border-l-2 border-pwd-gold pl-3 mb-3">
                  <p className="text-sm font-medium">{isHi ? u.messageHi : u.message}</p>
                  <p className="text-xs text-slate-400">{u.completionPercent}% · {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
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
          <div className="card flex items-center justify-center text-slate-400 h-48">Select a project</div>
        )}
      </div>
    </div>
  );
}
