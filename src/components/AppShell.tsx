import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Network, Camera, FolderKanban, User } from 'lucide-react';
import { getSession } from '@/store/store';
import { useStore } from '@/hooks/useStore';
import { getUnit, levelLabels } from '@/lib/hierarchy';
import { AshokaChakra, Emblem, Tricolor } from './Indic';

const SPLASH_KEY = 'cmpts-app-splash-shown';

function Splash() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gov-green text-white">
      <Tricolor className="absolute inset-x-0 top-0" />
      <Emblem className="h-20 w-20 animate-pulse" />
      <h1 className="mt-5 text-2xl font-bold tracking-wide">PWD Field</h1>
      <p className="mt-1 text-sm text-white/70">Government of Chhattisgarh</p>
      <p className="mt-1 text-xs text-pwd-gold">Public Works Department</p>
      <div className="mt-8 h-1 w-32 overflow-hidden rounded-full bg-white/20">
        <div className="h-full w-1/2 animate-[loadbar_1.2s_ease-in-out_infinite] rounded-full bg-pwd-gold" />
      </div>
      <Tricolor className="absolute inset-x-0 bottom-0" />
    </div>
  );
}

export default function AppShell() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const session = getSession();
  const { orgUnits } = useStore();
  const isHi = i18n.language === 'hi';
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem(SPLASH_KEY));

  useEffect(() => {
    if (!showSplash) return;
    const id = setTimeout(() => {
      sessionStorage.setItem(SPLASH_KEY, '1');
      setShowSplash(false);
    }, 1400);
    return () => clearTimeout(id);
  }, [showSplash]);

  if (showSplash) return <Splash />;
  if (!session) return <Navigate to="/app/login" replace />;

  const unit = getUnit(orgUnits, session.orgUnitId);
  const initials = session.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const tabs = [
    { to: '/app', label: t('appHome'), icon: Home, end: true },
    { to: '/app/hierarchy', label: t('hierarchy'), icon: Network },
    { to: '/app/capture', label: t('capture'), icon: Camera, primary: true },
    { to: '/app/projects', label: t('projects'), icon: FolderKanban },
    { to: '/app/profile', label: t('profile'), icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-100 sm:py-4">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 shadow-xl sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl sm:overflow-hidden">
        <header className="sticky top-0 z-40 bg-gov-green text-white">
          <Tricolor />
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <AshokaChakra className="h-7 w-7" color="#caa53d" />
              <div className="leading-tight">
                <div className="text-sm font-bold">PWD Field</div>
                <div className="text-[11px] text-white/70">
                  {unit ? `${levelLabels[unit.level][isHi ? 'hi' : 'en']} · ${isHi ? unit.nameHi : unit.name}` : t('dept')}
                </div>
              </div>
            </div>
            <NavLink
              to="/app/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-pwd-gold text-sm font-bold text-pwd-ink"
            >
              {initials}
            </NavLink>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto pb-24">
          <Outlet />
        </main>

        <nav className="absolute inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto grid max-w-md grid-cols-5">
            {tabs.map((tab) => {
              const active = tab.end
                ? location.pathname === tab.to
                : location.pathname.startsWith(tab.to);
              if (tab.primary) {
                return (
                  <NavLink key={tab.to} to={tab.to} className="flex flex-col items-center justify-end pb-1.5">
                    <span
                      className={`-mt-5 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white shadow-lg transition ${
                        active ? 'bg-pwd-greenDark' : 'bg-pwd-green'
                      }`}
                    >
                      <tab.icon className="h-6 w-6 text-white" />
                    </span>
                    <span className={`mt-0.5 text-[10px] font-medium ${active ? 'text-pwd-green' : 'text-slate-500'}`}>
                      {tab.label}
                    </span>
                  </NavLink>
                );
              }
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  end={tab.end}
                  className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                    active ? 'text-pwd-green' : 'text-slate-400'
                  }`}
                >
                  <tab.icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : ''}`} />
                  {tab.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
