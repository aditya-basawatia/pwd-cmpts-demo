import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { setLanguage } from '@/i18n';
import { getCurrentOtp } from '@/store/store';
import DemoBanner from './DemoBanner';
import { AshokaChakra, Emblem, SatyamevaJayate, Tricolor } from './Indic';

function LanguageToggle({ isHi }: { isHi: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center overflow-hidden rounded-full border border-pwd-green/30 text-xs font-semibold">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 transition ${!isHi ? 'bg-pwd-green text-white' : 'bg-white text-pwd-green'}`}
      >
        ENG
      </button>
      <button
        onClick={() => setLanguage('hi')}
        className={`px-3 py-1 font-hindi transition ${isHi ? 'bg-pwd-green text-white' : 'bg-white text-pwd-green'}`}
      >
        {t('hindi')}
      </button>
    </div>
  );
}

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

      {/* Tricolor strip */}
      <Tricolor />

      {/* Government identity bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2">
          <Link to="/" className="flex items-center gap-3">
            <Emblem className="h-12 w-12 shrink-0" />
            <div className="leading-tight">
              <div className="text-[11px] font-medium text-slate-500">{t('govtOfIndia')}</div>
              <div className="text-sm md:text-base font-bold text-pwd-green">{t('govt')}</div>
              <div className="text-[11px] text-slate-500">{t('dept')}</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <SatyamevaJayate className="hidden text-xs text-slate-500 sm:block" />
            <LanguageToggle isHi={isHi} />
          </div>
        </div>
      </div>

      {/* Primary green navigation */}
      <header className="bg-gov-green text-white shadow-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2">
            <AshokaChakra className="h-6 w-6" color="#caa53d" />
            <span className="font-bold tracking-wide">{t('appName')}</span>
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
            <Link to="/internal/login" className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25">
              {t('staffLogin')}
            </Link>
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
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

      <footer className="border-t bg-white">
        <Tricolor />
        <div className="py-6 text-center text-sm text-slate-500">
          <div className="mb-2 flex items-center justify-center gap-2">
            <AshokaChakra className="h-5 w-5" />
            <SatyamevaJayate className="text-xs" />
          </div>
          <p>{t('govt')} · {t('dept')}</p>
          <p className="mt-1 text-xs">{t('demoBanner')}</p>
        </div>
      </footer>
    </div>
  );
}
