import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/useStore';
import { roleLabels } from '@/lib/rbac';

export default function TeamPage() {
  const { t } = useTranslation();
  const { staff, divisions } = useStore();

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('team')}</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">{t('designation')}</th>
              <th className="pb-3 pr-4">{t('role')}</th>
              <th className="pb-3 pr-4">{t('division')}</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-3 pr-4">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-slate-400">{u.email}</div>
                </td>
                <td className="py-3 pr-4">{u.designation}</td>
                <td className="py-3 pr-4">{roleLabels[u.role].en}</td>
                <td className="py-3 pr-4 text-xs">
                  {u.divisionIds.map((did) => divisions.find((d) => d.id === did)?.name).filter(Boolean).join(', ')}
                </td>
                <td className="py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${u.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {u.active ? t('active') : t('inactive')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
