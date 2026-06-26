import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Zap } from 'lucide-react';
import { updateState, generateId, addAuditLog, addNotification } from '@/store/store';
import { useStore } from '@/hooks/useStore';
import type { ProjectType } from '@/types';

export default function WorkOrdersPage() {
  const { t } = useTranslation();
  const { divisions } = useStore();
  const [released, setReleased] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    nameHi: '',
    type: 'road' as ProjectType,
    divisionId: divisions[0]?.id || '',
    location: '',
    locationHi: '',
    workOrderRef: '',
    sanctionedValue: 0,
    contractor: '',
  });

  const handleRelease = () => {
    const id = generateId('proj');
    const now = new Date().toISOString();
    updateState((s) => ({
      ...s,
      projects: [
        {
          id,
          name: form.name,
          nameHi: form.nameHi || form.name,
          type: form.type,
          divisionId: form.divisionId,
          location: form.location,
          locationHi: form.locationHi || form.location,
          status: 'in_progress',
          completionPercent: 0,
          contractor: form.contractor,
          workOrderRef: form.workOrderRef,
          sanctionedValue: form.sanctionedValue,
          expectedCompletion: new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10),
          autoCreated: true,
          createdAt: now,
        },
        ...s.projects,
      ],
      statusUpdates: [
        {
          id: generateId('su'),
          projectId: id,
          message: 'Project auto-created from work order release',
          messageHi: 'कार्य आदेश जारी होने पर परियोजना स्वतः निर्मित',
          completionPercent: 0,
          createdAt: now,
        },
        ...s.statusUpdates,
      ],
    }));
    addAuditLog('WORK_ORDER_RELEASE', 'project', id, undefined, 'System', `WO: ${form.workOrderRef}`);
    addNotification('email', 'division-officer@pwd.cg.gov.in', `New work order ${form.workOrderRef} released. Project auto-created.`);
    setReleased(id);
    setForm({ name: '', nameHi: '', type: 'road', divisionId: divisions[0]?.id || '', location: '', locationHi: '', workOrderRef: '', sanctionedValue: 0, contractor: '' });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-2">{t('workOrders')}</h1>
      <p className="text-sm text-slate-500 mb-6">Simulate work order release → auto-create project (PDF Section 8.1)</p>

      {released && (
        <div className="card mb-6 border-green-200 bg-green-50 flex items-center gap-3">
          <Zap className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-800">Project auto-created!</p>
            <p className="text-sm text-green-700">ID: {released} — now visible in public project directory</p>
          </div>
        </div>
      )}

      <div className="card max-w-xl space-y-4">
        <h2 className="font-semibold flex items-center gap-2"><Zap className="h-5 w-5 text-pwd-gold" /> {t('releaseWorkOrder')}</h2>
        <div>
          <label className="label">{t('projectName')}</label>
          <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="label">Name (Hindi)</label>
          <input className="input" value={form.nameHi} onChange={(e) => setForm({ ...form, nameHi: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t('projectType')}</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ProjectType })}>
              <option value="building">Building</option>
              <option value="road">Road</option>
              <option value="bridge">Bridge</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="label">{t('division')}</label>
            <select className="input" value={form.divisionId} onChange={(e) => setForm({ ...form, divisionId: e.target.value })}>
              {divisions.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label">{t('location')}</label>
          <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className="label">{t('workOrder')} Ref</label>
          <input className="input" value={form.workOrderRef} onChange={(e) => setForm({ ...form, workOrderRef: e.target.value })} placeholder="WO/CG/2026/XXXX" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{t('contractor')}</label>
            <input className="input" value={form.contractor} onChange={(e) => setForm({ ...form, contractor: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('sanctionedValue')}</label>
            <input className="input" type="number" value={form.sanctionedValue} onChange={(e) => setForm({ ...form, sanctionedValue: +e.target.value })} />
          </div>
        </div>
        <button className="btn-primary w-full" onClick={handleRelease} disabled={!form.name || !form.workOrderRef}>
          <Zap className="mr-2 h-4 w-4 inline" /> {t('releaseWorkOrder')}
        </button>
      </div>
    </div>
  );
}
