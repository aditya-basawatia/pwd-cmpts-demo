import { useTranslation } from 'react-i18next';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { formatDate } from '@/lib/utils';

export default function IntegrationsPage() {
  const { t } = useTranslation();
  const { notifications } = useStore();

  const icons = { sms: Smartphone, email: Mail, push: Bell };

  return (
    <div>
      <h1 className="text-2xl font-bold text-pwd-navy mb-2">{t('integrations')}</h1>
      <p className="text-sm text-slate-500 mb-6">Integration Console — simulated OTP, SMS, email, and push notifications</p>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {[
          { title: 'OTP Service', status: 'Demo Mode', desc: 'OTP shown on-screen' },
          { title: 'SMS Gateway', status: 'Simulated', desc: 'Messages logged below' },
          { title: 'Work Order Feed', status: 'Simulator', desc: 'Manual release via Work Orders page' },
        ].map((item) => (
          <div key={item.title} className="card">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-5 w-5 text-pwd-gold" />
              <span className="font-semibold">{item.title}</span>
            </div>
            <span className="inline-block rounded-full bg-green-100 text-green-800 text-xs px-2 py-0.5 mb-2">{item.status}</span>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold mb-4">{t('notifications')} Log</h2>
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-500">No notifications yet.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((n) => {
              const Icon = icons[n.channel];
              return (
                <div key={n.id} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                  <Icon className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="uppercase text-xs font-medium text-slate-500">{n.channel}</span>
                      <span className="text-xs text-slate-400">→ {n.recipient}</span>
                    </div>
                    <p className="mt-1">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
