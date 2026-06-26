import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { getState, setSession, addAuditLog } from '@/store/store';

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
    setSession({ id: user.id, name: user.name, role: user.role, divisionIds: user.divisionIds });
    addAuditLog('LOGIN', 'user', user.id, user.id, user.name);
    navigate('/internal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pwd-navy to-slate-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center text-white mb-8">
          <Building2 className="mx-auto h-12 w-12 text-pwd-gold mb-3" />
          <h1 className="text-2xl font-bold">{t('internalPortal')}</h1>
          <p className="text-white/60 text-sm mt-1">PWD CMPTS - Chhattisgarh</p>
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
          <div className="text-xs text-slate-400 border-t pt-3 space-y-1">
            <p>Demo accounts:</p>
            <p>Super Admin: rajesh.verma@pwd.cg.gov.in / admin123</p>
            <p>Division Officer: amit.sharma@pwd.cg.gov.in / ee123</p>
            <p>Handler: vikram.singh@pwd.cg.gov.in / handler123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
