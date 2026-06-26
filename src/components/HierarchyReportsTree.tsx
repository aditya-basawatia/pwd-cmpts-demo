import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  complaintsInUnits,
  getDescendantIds,
  levelLabels,
  projectsInUnits,
  type OrgTreeNode,
} from '@/lib/hierarchy';
import { isOverdue } from '@/lib/utils';
import type { Complaint, OrgUnit, Project } from '@/types';

const levelColor: Record<string, string> = {
  state: 'bg-purple-100 text-purple-700',
  zone: 'bg-blue-100 text-blue-700',
  circle: 'bg-teal-100 text-teal-700',
  division: 'bg-amber-100 text-amber-700',
  subdivision: 'bg-green-100 text-green-700',
};

interface HierarchyReportsTreeProps {
  tree: OrgTreeNode;
  complaints: Complaint[];
  projects: Project[];
  orgUnits: OrgUnit[];
}

export default function HierarchyReportsTree({
  tree,
  complaints,
  projects,
  orgUnits,
}: HierarchyReportsTreeProps) {
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
    const unitComplaints = complaintsInUnits(complaints, projects, subtreeIds);
    const unitProjects = projectsInUnits(projects, subtreeIds);
    const overdue = unitComplaints.filter((c) => isOverdue(c.slaDueAt, c.status)).length;
    const resolved = unitComplaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;
    const avgProgress =
      unitProjects.length > 0
        ? Math.round(unitProjects.reduce((s, p) => s + p.completionPercent, 0) / unitProjects.length)
        : 0;

    return (
      <div key={node.unit.id}>
        <button
          type="button"
          onClick={() => toggle(node.unit.id)}
          className="flex w-full items-center gap-2 border-b border-slate-100 py-3 pr-3 text-left hover:bg-slate-50"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
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
            <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColor[node.unit.level]}`}>
              {levelLabels[node.unit.level][isHi ? 'hi' : 'en']}
            </span>
          </span>
          <div className="hidden sm:grid flex-shrink-0 grid-cols-4 gap-4 text-right text-xs">
            <div>
              <div className="font-semibold text-pwd-ink">{unitProjects.length}</div>
              <div className="text-slate-400">{t('projects')}</div>
            </div>
            <div>
              <div className="font-semibold text-pwd-ink">{unitComplaints.length}</div>
              <div className="text-slate-400">{t('complaints')}</div>
            </div>
            <div>
              <div className="font-semibold text-red-600">{overdue}</div>
              <div className="text-slate-400">{t('overdue')}</div>
            </div>
            <div>
              <div className="font-semibold text-green-600">{avgProgress}%</div>
              <div className="text-slate-400">{t('progress')}</div>
            </div>
          </div>
          <div className="sm:hidden text-right text-xs text-slate-500">
            {unitComplaints.length} / {unitProjects.length}
          </div>
        </button>
        {open && hasChildren && node.children.map((child) => renderNode(child, depth + 1))}
        {open && unitComplaints.length > 0 && (
          <div
            className="border-b border-slate-50 bg-slate-50/50 px-3 py-2 text-xs text-slate-500 sm:hidden"
            style={{ paddingLeft: `${depth * 20 + 36}px` }}
          >
            {resolved} resolved · {overdue} overdue · {avgProgress}% avg
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card overflow-hidden p-0">
      <div className="hidden border-b bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500 sm:grid sm:grid-cols-[1fr_repeat(4,5rem)] sm:gap-4">
        <span>{t('hierarchy')}</span>
        <span className="text-right">{t('projects')}</span>
        <span className="text-right">{t('complaints')}</span>
        <span className="text-right">{t('overdue')}</span>
        <span className="text-right">{t('progress')}</span>
      </div>
      {renderNode(tree, 0)}
    </div>
  );
}
