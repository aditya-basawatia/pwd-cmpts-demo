import { useTranslation } from 'react-i18next';
import { List, Network } from 'lucide-react';

export type DataViewMode = 'hierarchy' | 'flat';

export default function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: DataViewMode;
  onChange: (m: DataViewMode) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 text-sm">
      <button
        type="button"
        onClick={() => onChange('hierarchy')}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
          mode === 'hierarchy' ? 'bg-pwd-green text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <Network className="h-4 w-4" />
        {t('hierarchyView')}
      </button>
      <button
        type="button"
        onClick={() => onChange('flat')}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition ${
          mode === 'flat' ? 'bg-pwd-green text-white' : 'text-slate-600 hover:bg-slate-50'
        }`}
      >
        <List className="h-4 w-4" />
        {t('flatView')}
      </button>
    </div>
  );
}
