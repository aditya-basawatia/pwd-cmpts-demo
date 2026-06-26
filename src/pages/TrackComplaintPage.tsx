import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStore } from '@/hooks/useStore';
import { StatusBadge } from '@/components/Badges';
import { formatDate, statusLabels } from '@/lib/utils';
import { setOtp, verifyOtp, updateState } from '@/store/store';

export default function TrackComplaintPage() {
  const { t, i18n } = useTranslation();
  const { complaints, complaintEvents, projects } = useStore();
  const isHi = i18n.language === 'hi';
  const [params] = useSearchParams();
  const [ticket, setTicket] = useState(params.get('ticket') || '');
  const [mobile, setMobile] = useState(params.get('mobile') || '');
  const [otp, setOtpVal] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [verified, setVerified] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  const complaint = verified ? complaints.find((c) => c.ticketId === ticket && c.citizenMobile === mobile) : null;
  const events = complaint
    ? complaintEvents.filter((e) => e.complaintId === complaint.id).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];
  const project = complaint ? projects.find((p) => p.id === complaint.projectId) : null;

  const handleSendOtp = () => {
    const code = setOtp(mobile);
    setDemoOtp(code);
  };

  const handleVerify = () => {
    if (verifyOtp(mobile, otp)) setVerified(true);
    else alert('Invalid OTP');
  };

  const handleFeedback = () => {
    if (!complaint) return;
    updateState((s) => ({
      ...s,
      complaints: s.complaints.map((c) =>
        c.id === complaint.id ? { ...c, feedback, status: 'closed' as const, updatedAt: new Date().toISOString() } : c,
      ),
    }));
    alert('Thank you for your feedback!');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('trackComplaint')}</h1>

      {!verified ? (
        <div className="card space-y-4">
          <div>
            <label className="label">{t('ticketId')}</label>
            <input className="input font-mono" value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="PWD-2026-0001" />
          </div>
          <div>
            <label className="label">{t('mobileNumber')}</label>
            <input className="input" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>
          <button className="btn-secondary w-full" onClick={handleSendOtp}>{t('sendOtp')}</button>
          {demoOtp && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
              {t('demoOtp')}: <span className="font-mono font-bold">{demoOtp}</span>
            </div>
          )}
          <div>
            <label className="label">{t('verifyOtp')}</label>
            <input className="input text-center font-mono text-xl tracking-widest" maxLength={6} value={otp} onChange={(e) => setOtpVal(e.target.value)} />
          </div>
          <button className="btn-primary w-full" onClick={handleVerify}>{t('track')}</button>
        </div>
      ) : !complaint ? (
        <p className="text-center text-red-600 py-8">Complaint not found for this Ticket ID and mobile number.</p>
      ) : (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-mono text-xl font-bold text-pwd-navy">{complaint.ticketId}</h2>
              <StatusBadge status={complaint.status} />
            </div>
            <p className="text-sm text-slate-500 mb-2">Project: {isHi ? project?.nameHi : project?.name}</p>
            <p className="text-sm">{complaint.description}</p>
            {complaint.publicRemarks.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">Official Responses:</p>
                {complaint.publicRemarks.map((r, i) => (
                  <p key={i} className="text-sm text-slate-600 bg-green-50 rounded p-2 mb-1">{r}</p>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Status Timeline</h3>
            <div className="space-y-3">
              {events.map((e) => (
                <div key={e.id} className="flex gap-3 items-start">
                  <div className="h-3 w-3 rounded-full bg-pwd-gold mt-1.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{isHi ? statusLabels[e.status].hi : statusLabels[e.status].en}</p>
                    {e.publicRemark && <p className="text-sm text-slate-600">{e.publicRemark}</p>}
                    <p className="text-xs text-slate-400">{formatDate(e.createdAt, i18n.language)} · {e.createdByName}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {complaint.status === 'resolved' && !complaint.feedback && (
            <div className="card space-y-3">
              <h3 className="font-semibold">{t('feedback')}</h3>
              <div>
                <label className="label">{t('rating')}</label>
                <select className="input" value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: +e.target.value })}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}
                </select>
              </div>
              <textarea className="input" placeholder="Your comments..." value={feedback.comment} onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })} />
              <button className="btn-primary" onClick={handleFeedback}>{t('submitFeedback')}</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
