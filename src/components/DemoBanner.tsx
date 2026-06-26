import { useTranslation } from 'react-i18next';

export default function DemoBanner({ otp }: { otp?: string }) {
  const { t } = useTranslation();
  return (
    <div className="bg-amber-500 px-4 py-1.5 text-center text-xs font-medium text-amber-950">
      {t('demoBanner')}
      {otp && (
        <span className="ml-2 rounded bg-amber-900/20 px-2 py-0.5 font-mono">
          {t('demoOtp')}: {otp}
        </span>
      )}
    </div>
  );
}
