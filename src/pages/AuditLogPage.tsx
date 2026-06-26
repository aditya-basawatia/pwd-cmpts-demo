import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/useStore';
import { formatDate } from '@/lib/utils';

export default function AuditLogPage() {
  const { t } = useTranslation();
  const { auditLogs } = useStore();

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('auditLog')}</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-slate-500">
              <th className="pb-3 pr-4">Time</th>
              <th className="pb-3 pr-4">Action</th>
              <th className="pb-3 pr-4">Entity</th>
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id} className="border-b last:border-0">
                <td className="py-3 pr-4 text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
                <td className="py-3 pr-4 font-mono text-xs">{log.action}</td>
                <td className="py-3 pr-4">{log.entity}/{log.entityId.slice(0, 12)}</td>
                <td className="py-3 pr-4">{log.userName || '—'}</td>
                <td className="py-3 text-slate-600">{log.details || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
