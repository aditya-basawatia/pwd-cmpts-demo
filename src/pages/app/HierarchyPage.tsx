import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, FolderKanban, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useSession } from '@/hooks/useSession';
import {
  buildVisibleTree,
  getDescendantIds,
  headsOfUnit,
  levelLabels,
  projectsInUnits,
  staffInUnits,
  type OrgTreeNode,
} from '@/lib/hierarchy';

const levelColor: Record<string, string> = {
  state: 'bg-purple-100 text-purple-700',
  zone: 'bg-blue-100 text-blue-700',
  circle: 'bg-teal-100 text-teal-700',
  division: 'bg-amber-100 text-amber-700',
  subdivision: 'bg-green-100 text-green-700',
};

export default function HierarchyPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const { orgUnits, staff, projects } = useStore();
  const { session, staff: me } = useSession();

  const rootUnitId = me?.orgUnitId ?? session?.orgUnitId;
  const tree = useMemo(() => buildVisibleTree(orgUnits, rootUnitId), [orgUnits, rootUnitId]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(tree ? [tree.unit.id] : []));
  const [selectedId, setSelectedId] = useState<string | undefined>(tree?.unit.id);

  if (!tree) return <div className="p-6 text-center text-sm text-slate-500">{t('noResults')}</div>;

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selected = selectedId ? orgUnits.find((u) => u.id === selectedId) : undefined;
  const selectedDescendants = selected ? new Set(getDescendantIds(orgUnits, selected.id)) : new Set<string>();
  const selectedHeads = selected ? headsOfUnit(staff, selected.id) : [];
  const selectedProjects = selected
    ? projectsInUnits(projects, new Set([selected.id]))
    : [];
  const subtreeStaff = staffInUnits(staff, selectedDescendants).length;
  const subtreeProjects = projectsInUnits(projects, selectedDescendants).length;

  const renderNode = (node: OrgTreeNode, depth: number) => {
    const open = expanded.has(node.unit.id);
    const hasChildren = node.children.length > 0;
    const head = headsOfUnit(staff, node.unit.id)[0];
    const isSelected = selectedId === node.unit.id;
    return (
      <div key={node.unit.id}>
        <button
          onClick={() => {
            setSelectedId(node.unit.id);
            if (hasChildren) toggle(node.unit.id);
          }}
          className={`flex w-full items-center gap-2 rounded-lg py-2 pr-2 text-left transition ${
            isSelected ? 'bg-pwd-greenLight' : 'hover:bg-slate-50'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-slate-400">
            {hasChildren ? (
              open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-pwd-ink">
              {isHi ? node.unit.nameHi : node.unit.name}
            </span>
            <span className="block truncate text-[11px] text-slate-500">
              {head ? head.name : t('vacant')}
            </span>
          </span>
          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColor[node.unit.level]}`}>
            {levelLabels[node.unit.level][isHi ? 'hi' : 'en']}
          </span>
        </button>
        {open && hasChildren && <div>{node.children.map((c) => renderNode(c, depth + 1))}</div>}
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-lg font-bold text-pwd-ink">{t('hierarchy')}</h1>
        <p className="flex items-center gap-1 text-xs text-slate-500">
          <ShieldCheck className="h-3.5 w-3.5 text-pwd-green" />
          {t('hierarchyScopeNote')}
        </p>
      </div>

      <div className="card p-2">{renderNode(tree, 0)}</div>

      {selected && (
        <div className="card space-y-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-semibold text-pwd-ink">{isHi ? selected.nameHi : selected.name}</h2>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColor[selected.level]}`}>
                {levelLabels[selected.level][isHi ? 'hi' : 'en']}
              </span>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>{subtreeStaff} {t('officers')}</div>
              <div>{subtreeProjects} {t('projects')}</div>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t('officers')}</h3>
            {selectedHeads.length === 0 ? (
              <p className="text-sm text-slate-500">{t('vacant')}</p>
            ) : (
              <div className="space-y-2">
                {selectedHeads.map((h) => (
                  <div key={h.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pwd-greenLight text-pwd-green">
                      <UserRound className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-pwd-ink">{h.name}</p>
                      <p className="truncate text-xs text-slate-500">{h.designation}</p>
                    </div>
                    <a href={`tel:${h.mobile}`} className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-pwd-green">
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{t('projectsHere')}</h3>
            {selectedProjects.length === 0 ? (
              <p className="text-sm text-slate-500">{t('noResults')}</p>
            ) : (
              <div className="space-y-2">
                {selectedProjects.map((p) => (
                  <Link key={p.id} to={`/app/projects/${p.id}`} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                    <FolderKanban className="h-4 w-4 text-pwd-green" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-pwd-ink">{isHi ? p.nameHi : p.name}</p>
                      <p className="truncate text-xs text-slate-500">{isHi ? p.locationHi : p.location}</p>
                    </div>
                    <span className="text-xs font-semibold text-pwd-green">{p.completionPercent}%</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
