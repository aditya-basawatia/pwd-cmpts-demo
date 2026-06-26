import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getState, setSession, addAuditLog } from '@/store/store';
import { Emblem, SatyamevaJayate, Tricolor } from '@/components/Indic';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('amit.sharma@pwd.cg.gov.in');
  const [password, setPassword] = useState('ee123');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getState().staff.find((s) => s.email === email && s.password === password && s.active);
    if (!user) {
      setError('Invalid credentials');
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
    addAuditLog('LOGIN', 'user', user.id, user.id, user.name);
    navigate('/internal');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gov-green px-4">
      <Tricolor className="absolute inset-x-0 top-0" />
      <div className="w-full max-w-md">
        <div className="text-center text-white mb-8">
          <Emblem className="mx-auto h-16 w-16 mb-3" />
          <h1 className="text-2xl font-bold">{t('internalPortal')}</h1>
          <p className="text-white/70 text-sm mt-1">{t('govt')} · {t('dept')}</p>
          <SatyamevaJayate className="text-pwd-gold text-xs mt-2 inline-block" />
        </div>
        <form onSubmit={handleLogin} className="card space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="label">{t('email')}</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="label">{t('password')}</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full">{t('login')}</button>
          <button type="button" onClick={() => navigate('/app/login')} className="btn-secondary w-full">
            {t('openApp')}
          </button>
          <div className="text-xs text-slate-400 border-t pt-3 space-y-1">
            <p>Demo accounts:</p>
            <p>Demo (all access): demo@pwd.cg.gov.in / demo123</p>
            <p>Engineer-in-Chief: einc@pwd.cg.gov.in / einc123</p>
            <p>Super Admin: rajesh.verma@pwd.cg.gov.in / admin123</p>
            <p>Division Officer: amit.sharma@pwd.cg.gov.in / ee123</p>
            <p>Handler: vikram.singh@pwd.cg.gov.in / handler123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
