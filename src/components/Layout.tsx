import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Building2, Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { setLanguage } from '@/i18n';
import { getCurrentOtp } from '@/store/store';
import DemoBanner from './DemoBanner';

export default function Layout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const otp = getCurrentOtp();
  const isHi = i18n.language === 'hi';

  const nav = [
    { to: '/', label: t('home') },
    { to: '/projects', label: t('projects') },
    { to: '/lodge', label: t('lodgeComplaint') },
    { to: '/track', label: t('trackComplaint') },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <DemoBanner otp={otp?.code} />
      <header className="bg-pwd-navy text-white shadow-lg sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Building2 className="h-6 w-6 text-pwd-gold" />
            </div>
            <div>
              <div className="font-bold leading-tight">{t('appName')}</div>
              <div className="text-xs text-white/70">{t('dept')}</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition hover:text-pwd-gold ${location.pathname === item.to ? 'text-pwd-gold' : 'text-white/90'}`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/internal/login" className="btn-secondary !text-pwd-navy text-sm">
              {t('staffLogin')}
            </Link>
            <button
              onClick={() => setLanguage(isHi ? 'en' : 'hi')}
              className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              <Globe className="h-4 w-4" />
              {isHi ? t('english') : t('hindi')}
            </button>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <div className="border-t border-white/10 px-4 py-3 md:hidden">
            {nav.map((item) => (
              <Link key={item.to} to={item.to} className="block py-2" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/internal/login" className="block py-2" onClick={() => setOpen(false)}>
              {t('staffLogin')}
            </Link>
          </div>
        )}
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
        <p>{t('govt')} · {t('dept')}</p>
        <p className="mt-1 text-xs">{t('demoBanner')}</p>
      </footer>
    </div>
  );
}
