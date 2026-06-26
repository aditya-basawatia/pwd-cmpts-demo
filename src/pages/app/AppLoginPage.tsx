import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Lock, Mail } from 'lucide-react';
import { addAuditLog, getState, setSession } from '@/store/store';
import { Emblem, SatyamevaJayate, Tricolor } from '@/components/Indic';

const DEMO_ACCOUNTS = [
  { label: 'Engineer-in-Chief (State)', email: 'einc@pwd.cg.gov.in', password: 'einc123' },
  { label: 'Chief Engineer (Raipur Zone)', email: 'ce.raipur@pwd.cg.gov.in', password: 'ce123' },
  { label: 'Superintending Engineer (Raipur Circle-1)', email: 'se.raipur1@pwd.cg.gov.in', password: 'se123' },
  { label: 'Executive Engineer (Raipur Division-1)', email: 'ee.raipur1@pwd.cg.gov.in', password: 'ee123' },
  { label: 'Sub-Divisional Officer (Arang) — field', email: 'sdo.arang@pwd.cg.gov.in', password: 'sdo123' },
  { label: 'Demo Officer — capture from anywhere', email: 'demo@pwd.cg.gov.in', password: 'demo123' },
];

export default function AppLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('sdo.arang@pwd.cg.gov.in');
  const [password, setPassword] = useState('sdo123');
  const [error, setError] = useState('');

  const doLogin = (em: string, pw: string) => {
    const user = getState().staff.find((s) => s.email === em && s.password === pw && s.active);
    if (!user) {
      setError(t('invalidCredentials'));
      return;
    }
    setSession({
      id: user.id,
      name: user.name,
      role: user.role,
      divisionIds: user.divisionIds,
      orgUnitId: user.orgUnitId,
      designation: user.designation,
      demoOverride: user.demoOverride,
    });
    addAuditLog('LOGIN', 'user', user.id, user.id, user.name, 'Field app login');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-100 sm:py-4">
      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-gov-green text-white shadow-xl sm:min-h-[calc(100vh-2rem)] sm:rounded-3xl sm:overflow-hidden">
        <Tricolor className="absolute inset-x-0 top-0" />

        <div className="flex flex-1 flex-col justify-center px-6 py-10">
          <div className="text-center">
            <Emblem className="mx-auto h-16 w-16" />
            <h1 className="mt-4 text-2xl font-bold">PWD Field</h1>
            <p className="mt-1 text-sm text-white/70">{t('govt')}</p>
            <p className="text-xs text-white/60">{t('dept')}</p>
            <SatyamevaJayate className="mt-2 inline-block text-xs text-pwd-gold" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              doLogin(email, password);
            }}
            className="mt-8 space-y-4 rounded-2xl bg-white p-5 text-slate-900 shadow-lg"
          >
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <div>
              <label className="label">{t('email')}</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label className="label">{t('password')}</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="input pl-9"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full">
              {t('login')}
            </button>
          </form>

          <div className="mt-6">
            <p className="mb-2 text-center text-xs uppercase tracking-wide text-white/60">{t('demoAccountsByLevel')}</p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => doLogin(acc.email, acc.password)}
                  className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 text-left text-sm transition hover:bg-white/20"
                >
                  <span>{acc.label}</span>
                  <ChevronRight className="h-4 w-4 text-pwd-gold" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <Tricolor className="absolute inset-x-0 bottom-0" />
      </div>
    </div>
  );
}
