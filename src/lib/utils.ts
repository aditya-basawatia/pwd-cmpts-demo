import type { ComplaintStatus } from '@/types';

export const complaintStatusFlow: ComplaintStatus[] = [
  'submitted',
  'acknowledged',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'closed',
];

export const statusLabels: Record<ComplaintStatus, { en: string; hi: string; color: string }> = {
  submitted: { en: 'Submitted', hi: 'प्रस्तुत', color: 'bg-blue-100 text-blue-800' },
  acknowledged: { en: 'Acknowledged', hi: 'स्वीकृत', color: 'bg-indigo-100 text-indigo-800' },
  under_review: { en: 'Under Review', hi: 'समीक्षाधीन', color: 'bg-purple-100 text-purple-800' },
  assigned: { en: 'Assigned', hi: 'आवंटित', color: 'bg-amber-100 text-amber-800' },
  in_progress: { en: 'In Progress', hi: 'प्रगति पर', color: 'bg-orange-100 text-orange-800' },
  resolved: { en: 'Resolved', hi: 'निराकृत', color: 'bg-green-100 text-green-800' },
  closed: { en: 'Closed', hi: 'बंद', color: 'bg-gray-100 text-gray-800' },
  reopened: { en: 'Reopened', hi: 'पुनः खोला', color: 'bg-red-100 text-red-800' },
};

export function isOverdue(slaDueAt: string, status: ComplaintStatus) {
  if (['resolved', 'closed'].includes(status)) return false;
  return new Date(slaDueAt) < new Date();
}

export function formatDate(iso: string, locale = 'en-IN') {
  return new Date(iso).toLocaleString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function exportCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
