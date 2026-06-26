import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, LayoutDashboard, LogOut, RotateCcw, ShieldCheck } from 'lucide-react';
import { resetDemo, setSession } from '@/store/store';
import { useSession } from '@/hooks/useSession';
import { useStore } from '@/hooks/useStore';
import { setLanguage } from '@/i18n';
import { getAncestors, getUnit, levelLabels } from '@/lib/hierarchy';
import { roleLabels } from '@/lib/rbac';

export default function AppProfilePage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const navigate = useNavigate();
  const { orgUnits } = useStore();
  const { session, staff } = useSession();

  const unit = getUnit(orgUnits, staff?.orgUnitId ?? session?.orgUnitId);
  const ancestors = unit ? getAncestors(orgUnits, unit.id).reverse() : [];
  const initials = (session?.name ?? '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-4 p-4">
      <div className="card flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-pwd-green text-lg font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-pwd-ink">{session?.name}</h1>
          <p className="truncate text-sm text-slate-500">{session?.designation}</p>
          {session && <p className="text-xs text-slate-400">{roleLabels[session.role].en}</p>}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-2 flex items-center gap-1 text-sm font-semibold text-pwd-ink">
          <ShieldCheck className="h-4 w-4 text-pwd-green" /> {t('yourScope')}
        </h2>
        {unit ? (
          <>
            <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
              {ancestors.map((a) => (
                <span key={a.id}>{isHi ? a.nameHi : a.name} ›</span>
              ))}
              <span className="font-semibold text-pwd-ink">{isHi ? unit.nameHi : unit.name}</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {levelLabels[unit.level][isHi ? 'hi' : 'en']} — {t('hierarchyScopeNote')}
            </p>
          </>
        ) : (
          <p className="text-xs text-slate-500">{t('fullStateAccess')}</p>
        )}
      </div>

      <button
        onClick={() => setLanguage(isHi ? 'en' : 'hi')}
        className="card flex w-full items-center gap-3 text-left"
      >
        <Globe className="h-5 w-5 text-pwd-green" />
        <span className="flex-1 text-sm font-medium text-pwd-ink">{t('language')}</span>
        <span className="text-sm text-slate-500">{isHi ? 'English' : 'हिंदी'}</span>
      </button>

      <button
        onClick={() => navigate('/internal')}
        className="card flex w-full items-center gap-3 text-left"
      >
        <LayoutDashboard className="h-5 w-5 text-pwd-green" />
        <span className="flex-1 text-sm font-medium text-pwd-ink">{t('openDesktopPortal')}</span>
      </button>

      <button
        onClick={() => {
          if (window.confirm(t('resetConfirm'))) {
            resetDemo();
            window.alert(t('resetDone'));
          }
        }}
        className="card flex w-full items-center gap-3 text-left"
      >
        <RotateCcw className="h-5 w-5 text-slate-500" />
        <span className="flex-1">
          <span className="block text-sm font-medium text-pwd-ink">{t('resetDemo')}</span>
          <span className="block text-xs text-slate-500">{t('resetDemoHint')}</span>
        </span>
      </button>

      <button
        onClick={() => {
          setSession(null);
          navigate('/app/login');
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
      >
        <LogOut className="h-4 w-4" /> {t('logout')}
      </button>
    </div>
  );
}
