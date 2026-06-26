import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
  complaintsForUnit,
  complaintsInUnits,
  getDescendantIds,
  levelLabels,
  type OrgTreeNode,
} from '@/lib/hierarchy';
import { isOverdue } from '@/lib/utils';
import type { Complaint, OrgUnit, Project } from '@/types';
import { StatusBadge } from './Badges';

const levelColor: Record<string, string> = {
  state: 'bg-purple-100 text-purple-700',
  zone: 'bg-blue-100 text-blue-700',
  circle: 'bg-teal-100 text-teal-700',
  division: 'bg-amber-100 text-amber-700',
  subdivision: 'bg-green-100 text-green-700',
};

interface HierarchyComplaintsTreeProps {
  tree: OrgTreeNode;
  complaints: Complaint[];
  projects: Project[];
  orgUnits: OrgUnit[];
}

export default function HierarchyComplaintsTree({
  tree,
  complaints,
  projects,
  orgUnits,
}: HierarchyComplaintsTreeProps) {
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
    const subtreeComplaints = complaintsInUnits(complaints, projects, subtreeIds);
    const directComplaints = complaintsForUnit(complaints, projects, node.unit.id);

    return (
      <div key={node.unit.id} className="border-b border-slate-100 last:border-0">
        <button
          type="button"
          onClick={() => toggle(node.unit.id)}
          className="flex w-full items-center gap-2 py-3 pr-2 text-left hover:bg-slate-50"
          style={{ paddingLeft: `${depth * 20 + 12}px` }}
        >
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center text-slate-400">
            {hasChildren || directComplaints.length > 0 ? (
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
              {subtreeComplaints.length} {t('complaints').toLowerCase()}
              {directComplaints.length > 0 && ` · ${directComplaints.length} ${t('directHere')}`}
            </span>
          </span>
          <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${levelColor[node.unit.level]}`}>
            {levelLabels[node.unit.level][isHi ? 'hi' : 'en']}
          </span>
        </button>

        {open && directComplaints.length > 0 && (
          <div className="pb-2" style={{ paddingLeft: `${depth * 20 + 36}px` }}>
            {directComplaints.map((c) => (
              <Link
                key={c.id}
                to={`/internal/complaints/${c.id}`}
                className={`mb-1 flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 ${
                  isOverdue(c.slaDueAt, c.status) ? 'border-red-200 bg-red-50/50' : 'border-slate-100'
                }`}
              >
                <div className="min-w-0">
                  <span className="font-mono font-medium text-pwd-navy">{c.ticketId}</span>
                  <p className="truncate text-xs text-slate-500">{c.description}</p>
                </div>
                <StatusBadge status={c.status} />
              </Link>
            ))}
          </div>
        )}

        {open && hasChildren && node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return <div className="card divide-y divide-slate-100 p-0 overflow-hidden">{renderNode(tree, 0)}</div>;
}
