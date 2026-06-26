import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  getDescendantIds,
  levelLabels,
  projectsForUnit,
  projectsInUnits,
  type OrgTreeNode,
} from '@/lib/hierarchy';
import type { OrgUnit, Project } from '@/types';
import { ProgressBar, ProjectStatusBadge } from './Badges';

const levelColor: Record<string, string> = {
  state: 'bg-purple-100 text-purple-700',
  zone: 'bg-blue-100 text-blue-700',
  circle: 'bg-teal-100 text-teal-700',
  division: 'bg-amber-100 text-amber-700',
  subdivision: 'bg-green-100 text-green-700',
};

interface HierarchyProjectsTreeProps {
  tree: OrgTreeNode;
  projects: Project[];
  orgUnits: OrgUnit[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function HierarchyProjectsTree({
  tree,
  projects,
  orgUnits,
  selectedId,
  onSelect,
}: HierarchyProjectsTreeProps) {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([tree.unit.id]));

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const renderNode = (node: OrgTreeNode, depth: number) => {
    const open = expanded.has(node.unit.id);
    const hasChildren = node.children.length > 0;
    const subtreeIds = new Set(getDescendantIds(orgUnits, node.unit.id));
    const subtreeProjects = projectsInUnits(projects, subtreeIds);
    const directProjects = projectsForUnit(projects, node.unit.id);

    return (
      <div key={node.unit.id}>
        <button
          type="button"
          onClick={() => toggle(node.unit.id)}
          className="flex w-full items-center gap-2 border-b border-slate-100 py-2.5 pr-2 text-left hover:bg-slate-50"
          style={{ paddingLeft: `${depth * 18 + 10}px` }}
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-slate-400">
            {hasChildren || directProjects.length > 0 ? (
              open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-pwd-ink">
              {isHi ? node.unit.nameHi : node.unit.name}
            </span>
            <span className="text-xs text-slate-500">
              {subtreeProjects.length} {t('projects').toLowerCase()}
            </span>
          </span>
          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColor[node.unit.level]}`}>
            {levelLabels[node.unit.level][isHi ? 'hi' : 'en']}
          </span>
        </button>

        {open && directProjects.length > 0 && (
          <div className="py-1" style={{ paddingLeft: `${depth * 18 + 34}px` }}>
            {directProjects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelect(p.id)}
                className={`mb-1 block w-full rounded-lg border p-2.5 text-left transition ${
                  selectedId === p.id ? 'border-pwd-navy bg-pwd-navy/5' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="truncate text-sm font-medium text-pwd-ink">{isHi ? p.nameHi : p.name}</span>
                  <ProjectStatusBadge status={p.status} />
                </div>
                <div className="mt-1.5">
                  <ProgressBar percent={p.completionPercent} />
                </div>
              </button>
            ))}
          </div>
        )}

        {open && hasChildren && node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return <div className="card max-h-[600px] overflow-y-auto p-0">{renderNode(tree, 0)}</div>;
}
