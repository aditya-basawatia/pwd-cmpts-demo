import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ProgressBar, ProjectStatusBadge, TypeIcon } from '@/components/Badges';
import type { ProjectStatus, ProjectType } from '@/types';

export default function ProjectsPage() {
  const { t, i18n } = useTranslation();
  const { projects, divisions } = useStore();
  const isHi = i18n.language === 'hi';
  const [search, setSearch] = useState('');
  const [division, setDivision] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.id.includes(q);
      const matchDiv = !division || p.divisionId === division;
      const matchType = !type || p.type === type;
      const matchStatus = !status || p.status === status;
      return matchSearch && matchDiv && matchType && matchStatus;
    });
  }, [projects, search, division, type, status]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('projects')}</h1>

      <div className="card mb-6">
        <div className="grid gap-4 md:grid-cols-5">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input className="input pl-9" placeholder={t('search')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="input" value={division} onChange={(e) => setDivision(e.target.value)}>
            <option value="">{t('allDivisions')}</option>
            {divisions.map((d) => <option key={d.id} value={d.id}>{isHi ? d.nameHi : d.name}</option>)}
          </select>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">{t('allTypes')}</option>
            {(['building', 'road', 'bridge', 'other'] as ProjectType[]).map((tp) => (
              <option key={tp} value={tp}>{t(tp)}</option>
            ))}
          </select>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">{t('allStatuses')}</option>
            {(['in_progress', 'completed', 'planned'] as ProjectStatus[]).map((s) => (
              <option key={s} value={s}>{t(s === 'in_progress' ? 'inProgress' : s)}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-12">{t('noResults')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const div = divisions.find((d) => d.id === p.divisionId);
            return (
              <Link key={p.id} to={`/projects/${p.id}`} className="card hover:shadow-md transition">
                <div className="flex items-start gap-3 mb-3">
                  <TypeIcon type={p.type} />
                  <div className="flex-1">
                    <h3 className="font-semibold text-pwd-navy">{isHi ? p.nameHi : p.name}</h3>
                    <p className="text-xs text-slate-500">{isHi ? div?.nameHi : div?.name}</p>
                  </div>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <p className="text-sm text-slate-600 mb-3">{isHi ? p.locationHi : p.location}</p>
                <ProgressBar percent={p.completionPercent} />
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span>{p.completionPercent}%</span>
                  {p.workOrderRef && <span>{p.workOrderRef}</span>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
