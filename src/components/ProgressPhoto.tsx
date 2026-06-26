import { ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Shows a field-captured progress photo, or a dashed placeholder when an
 * update has no image attached. Used in project detail views.
 */
export default function ProgressPhoto({
  src,
  alt = '',
  className = '',
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  if (src) {
    return <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />;
  }
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 border border-dashed border-slate-300 bg-slate-100 text-slate-400 ${className}`}
      role="img"
      aria-label={t('noPhotoCaptured')}
    >
      <ImageOff className="h-6 w-6" />
      <span className="text-[11px]">{t('noPhotoCaptured')}</span>
    </div>
  );
}
