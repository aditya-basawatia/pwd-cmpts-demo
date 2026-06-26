import type { ComplaintStatus, ProjectStatus, ProjectType } from '@/types';
import { statusLabels } from '@/lib/utils';

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const s = statusLabels[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${s.color}`}>{s.en}</span>;
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const colors: Record<ProjectStatus, string> = {
    in_progress: 'bg-orange-100 text-orange-800',
    completed: 'bg-green-100 text-green-800',
    planned: 'bg-slate-100 text-slate-800',
  };
  const labels: Record<ProjectStatus, string> = {
    in_progress: 'In Progress',
    completed: 'Completed',
    planned: 'Planned',
  };
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}>{labels[status]}</span>;
}

export function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="h-2.5 w-full rounded-full bg-slate-200">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-pwd-green to-pwd-gold transition-all"
        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
      />
    </div>
  );
}

export function TypeIcon({ type }: { type: ProjectType }) {
  const icons: Record<ProjectType, string> = {
    building: '🏢',
    road: '🛣️',
    bridge: '🌉',
    other: '🏗️',
  };
  return <span className="text-xl">{icons[type]}</span>;
}
