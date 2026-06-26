import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, MessageSquareWarning, FolderKanban,
  FileText, Users, BarChart3, Plug, ScrollText, LogOut, RotateCcw,
} from 'lucide-react';
import { getSession, resetDemo, setSession } from '@/store/store';
import { roleLabels } from '@/lib/rbac';
import { AshokaChakra, Tricolor } from './Indic';

export default function InternalLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const session = getSession();

  if (!session) return <Navigate to="/internal/login" replace />;

  const nav = [
    { to: '/internal', label: t('dashboard'), icon: LayoutDashboard, exact: true },
    { to: '/internal/complaints', label: t('complaints'), icon: MessageSquareWarning },
    { to: '/internal/projects', label: t('projects'), icon: FolderKanban },
    { to: '/internal/work-orders', label: t('workOrders'), icon: FileText },
    { to: '/internal/team', label: t('team'), icon: Users },
    { to: '/internal/reports', label: t('reports'), icon: BarChart3 },
    { to: '/internal/integrations', label: t('integrations'), icon: Plug },
    { to: '/internal/audit', label: t('auditLog'), icon: ScrollText },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-64 flex-col bg-gov-green text-white lg:flex">
        <Tricolor />
        <div className="flex items-center gap-2 border-b border-white/10 p-4">
          <AshokaChakra className="h-8 w-8" color="#caa53d" />
          <div>
            <div className="font-bold text-sm">{t('internalPortal')}</div>
            <div className="text-xs text-white/60">CMPTS</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${active ? 'bg-white/15 text-pwd-gold' : 'text-white/80 hover:bg-white/10'}`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3 space-y-2">
          <div className="px-3 text-xs text-white/60">
            {session.name}<br />
            {roleLabels[session.role].en}
          </div>
          <button
            onClick={() => { resetDemo(); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" /> {t('resetDemo')}
          </button>
          <button
            onClick={() => { setSession(null); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" /> {t('logout')}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-pwd-navy">{t('internalPortal')}</span>
            <button onClick={() => setSession(null)} className="text-sm text-red-600">{t('logout')}</button>
          </div>
          <div className="mt-2 flex gap-2 overflow-x-auto text-xs">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="whitespace-nowrap rounded bg-slate-100 px-2 py-1">
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
