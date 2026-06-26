import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import {
  setOtp, verifyOtp, updateState, generateId, generateTicketId,
  addAuditLog, addNotification,
} from '@/store/store';

export default function LodgeComplaintPage() {
  const { t, i18n } = useTranslation();
  const { projects, categories } = useStore();
  const isHi = i18n.language === 'hi';
  const [params] = useSearchParams();
  const [step, setStep] = useState<'form' | 'otp' | 'done'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [form, setForm] = useState({
    projectId: params.get('project') || '',
    name: '',
    mobile: '9876543210',
    category: '',
    description: '',
    location: '',
  });
  const [media, setMedia] = useState<{ name: string; type: string; dataUrl: string }[]>([]);

  const handleSendOtp = () => {
    if (!form.mobile || form.mobile.length < 10) return;
    const code = setOtp(form.mobile);
    setDemoOtp(code);
    setStep('otp');
  };

  const handleSubmit = () => {
    if (!verifyOtp(form.mobile, otpCode)) {
      alert('Invalid OTP. Use the demo OTP shown in the banner.');
      return;
    }
    const tid = generateTicketId();
    const cmpId = generateId('cmp');
    const cat = categories.find((c) => c.id === form.category);
    const now = new Date().toISOString();
    const slaDays = cat?.slaDays || 7;
    const slaDue = new Date(Date.now() + slaDays * 86400000).toISOString();

    updateState((s) => ({
      ...s,
      complaints: [
        {
          id: cmpId,
          ticketId: tid,
          projectId: form.projectId,
          citizenName: form.name,
          citizenMobile: form.mobile,
          category: form.category,
          description: form.description,
          location: form.location,
          status: 'submitted',
          priority: form.category === 'cat-safety' ? 'urgent' : 'medium',
          slaDueAt: slaDue,
          media: media.map((m, i) => ({ id: generateId('med'), ...m })),
          resolutionMedia: [],
          publicRemarks: [],
          createdAt: now,
          updatedAt: now,
        },
        ...s.complaints,
      ],
      complaintEvents: [
        { id: generateId('ce'), complaintId: cmpId, status: 'submitted' as const, createdAt: now, createdByName: 'Citizen' },
        ...s.complaintEvents,
      ],
    }));

    addNotification('sms', form.mobile, `Your complaint ${tid} has been registered. Track at CMPTS portal.`);
    setTicketId(tid);
    setStep('done');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setMedia((prev) => [...prev, { name: file.name, type: file.type, dataUrl: reader.result as string }]);
      };
      reader.readAsDataURL(file);
    });
  };

  if (step === 'done') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-pwd-green mb-4" />
        <h1 className="text-2xl font-bold text-pwd-navy mb-2">Complaint Registered!</h1>
        <p className="text-slate-600 mb-4">Your Ticket ID:</p>
        <p className="text-3xl font-mono font-bold text-pwd-gold mb-6">{ticketId}</p>
        <Link to={`/track?ticket=${ticketId}&mobile=${form.mobile}`} className="btn-primary">
          {t('trackComplaint')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-pwd-navy mb-6">{t('lodgeNew')}</h1>

      {step === 'form' && (
        <div className="card space-y-4">
          <div>
            <label className="label">{t('selectProject')}</label>
            <select className="input" value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}>
              <option value="">-- Select --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{isHi ? p.nameHi : p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('citizenName')}</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('mobileNumber')}</label>
            <input className="input" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('category')}</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">-- Select --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{isHi ? c.nameHi : c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">{t('description')}</label>
            <textarea className="input min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('location')}</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">{t('uploadMedia')}</label>
            <input type="file" accept="image/*,video/*" capture="environment" multiple onChange={handleFile} className="input" />
            {media.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {media.map((m, i) => (
                  <img key={i} src={m.dataUrl} alt={m.name} className="h-16 w-16 rounded object-cover" />
                ))}
              </div>
            )}
          </div>
          <button
            className="btn-primary w-full"
            onClick={handleSendOtp}
            disabled={!form.projectId || !form.name || !form.category || !form.description}
          >
            {t('sendOtp')}
          </button>
        </div>
      )}

      {step === 'otp' && (
        <div className="card space-y-4">
          <p className="text-sm text-slate-600">{t('otpSent')}</p>
          {demoOtp && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
              <span className="text-sm">{t('demoOtp')}: </span>
              <span className="font-mono font-bold text-lg">{demoOtp}</span>
            </div>
          )}
          <div>
            <label className="label">{t('verifyOtp')}</label>
            <input className="input text-center text-2xl tracking-widest font-mono" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value)} />
          </div>
          <button className="btn-primary w-full" onClick={handleSubmit}>{t('submit')}</button>
        </div>
      )}
    </div>
  );
}
