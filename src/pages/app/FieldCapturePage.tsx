import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, ArrowLeft, Camera, CheckCircle2, Crosshair, Loader2,
  MapPin, RefreshCw, Navigation, ShieldAlert,
} from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { useSession } from '@/hooks/useSession';
import { addAuditLog, addStatusUpdate } from '@/store/store';
import { ProgressBar } from '@/components/Badges';
import { ON_SITE_RADIUS_M, distanceMeters, projectsInUnits } from '@/lib/hierarchy';
import type { Project } from '@/types';

type Step = 'select' | 'locate' | 'capture' | 'details' | 'done';

interface GeoPos {
  lat: number;
  lng: number;
  accuracy: number;
}

export default function FieldCapturePage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { projects } = useStore();
  const { session, staff, visibleUnitIds } = useSession();
  const override = !!(staff?.demoOverride ?? session?.demoOverride);

  const scoped = projectsInUnits(projects, visibleUnitIds).filter((p) => p.status !== 'completed');

  const [step, setStep] = useState<Step>('select');
  const [project, setProject] = useState<Project | null>(null);
  const [pos, setPos] = useState<GeoPos | null>(null);
  const [geoError, setGeoError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [percent, setPercent] = useState(0);
  const [milestone, setMilestone] = useState('');
  const [message, setMessage] = useState('');
  const [camError, setCamError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Preselect from ?project= deep link.
  useEffect(() => {
    const pid = params.get('project');
    if (pid) {
      const p = projects.find((x) => x.id === pid);
      if (p) {
        setProject(p);
        setPercent(p.completionPercent);
        setStep('locate');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Watch position while on the locate step.
  useEffect(() => {
    if (step !== 'locate') return;
    if (!('geolocation' in navigator)) {
      setGeoError(t('geoUnsupported'));
      return;
    }
    setGeoError('');
    const id = navigator.geolocation.watchPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude, accuracy: p.coords.accuracy }),
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [step, t]);

  const distance =
    project?.lat != null && project?.lng != null && pos
      ? distanceMeters(pos.lat, pos.lng, project.lat, project.lng)
      : null;
  const onSite = distance != null && distance <= ON_SITE_RADIUS_M;
  // With the demo override, treat the user as on-site and fall back to the
  // project's own coordinates when no real GPS fix is available.
  const effectiveOnSite = onSite || override;
  const effectivePos =
    pos ??
    (override && project?.lat != null && project?.lng != null
      ? { lat: project.lat, lng: project.lng, accuracy: 8 }
      : null);
  const effectiveDistance = distance != null ? distance : override ? 0 : null;

  // Camera lifecycle.
  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
  };
  useEffect(() => {
    if (step !== 'capture') {
      stopCamera();
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (e) {
        setCamError(t('cameraError'));
      }
    })();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [step, t]);

  useEffect(() => () => stopCamera(), []);

  const stampAndCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 960;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);

    // Geo + timestamp overlay (tamper-evident style banner).
    const pad = Math.round(w * 0.02);
    const lines = [
      `${project ? (isHi ? project.nameHi : project.name) : ''}`,
      effectivePos
        ? `GPS ${effectivePos.lat.toFixed(5)}, ${effectivePos.lng.toFixed(5)} (±${Math.round(effectivePos.accuracy)}m)`
        : 'GPS unavailable',
      `${new Date().toLocaleString('en-IN')} · ${effectiveOnSite ? 'ON-SITE' : 'OFF-SITE'}${override ? ' (DEMO)' : ''}`,
    ];
    const fontSize = Math.round(w * 0.032);
    ctx.font = `600 ${fontSize}px Inter, sans-serif`;
    const bandH = fontSize * lines.length + pad * (lines.length + 1);
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, h - bandH, w, bandH);
    ctx.fillStyle = '#ffffff';
    lines.forEach((ln, i) => {
      ctx.fillText(ln, pad, h - bandH + pad + fontSize * (i + 1) + pad * i);
    });

    setPhoto(canvas.toDataURL('image/jpeg', 0.7));
    stopCamera();
    setStep('details');
  };

  const onFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
      setStep('details');
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!project) return;
    addStatusUpdate({
      projectId: project.id,
      message: message || `${t('progressUpdate')}: ${percent}%`,
      messageHi: message || `${t('progressUpdate')}: ${percent}%`,
      completionPercent: percent,
      milestoneLabel: milestone || undefined,
      createdBy: session?.id,
      createdByName: session?.name,
      photoDataUrl: photo ?? undefined,
      lat: effectivePos?.lat,
      lng: effectivePos?.lng,
      accuracyM: effectivePos ? Math.round(effectivePos.accuracy) : undefined,
      distanceM: effectiveDistance != null ? Math.round(effectiveDistance) : undefined,
      onSite: effectiveOnSite,
    });
    addAuditLog(
      'FIELD_PROGRESS',
      'project',
      project.id,
      session?.id,
      session?.name,
      `${percent}% ${effectiveOnSite ? '(on-site)' : '(off-site)'}${override ? ' [demo]' : ''} field capture`,
    );
    setStep('done');
  };

  // ---- Step renderers ----
  if (step === 'select') {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-lg font-bold text-pwd-ink">{t('captureProgress')}</h1>
        <p className="text-sm text-slate-500">{t('selectProjectToCapture')}</p>
        {scoped.length === 0 ? (
          <div className="card text-center text-sm text-slate-500">{t('noResults')}</div>
        ) : (
          <div className="space-y-2">
            {scoped.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setProject(p);
                  setPercent(p.completionPercent);
                  setStep('locate');
                }}
                className="card flex w-full items-center gap-3 p-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-pwd-ink">{isHi ? p.nameHi : p.name}</p>
                  <p className="truncate text-xs text-slate-500">{isHi ? p.locationHi : p.location}</p>
                </div>
                <span className="text-xs font-semibold text-pwd-green">{p.completionPercent}%</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step === 'locate') {
    return (
      <div className="space-y-4 p-4">
        <button onClick={() => setStep('select')} className="inline-flex items-center text-sm text-slate-500">
          <ArrowLeft className="mr-1 h-4 w-4" /> {t('back')}
        </button>
        <h1 className="text-lg font-bold text-pwd-ink">{t('goToSite')}</h1>
        <div className="card">
          <p className="text-sm font-medium text-pwd-ink">{project && (isHi ? project.nameHi : project.name)}</p>
          <p className="text-xs text-slate-500">{project && (isHi ? project.locationHi : project.location)}</p>
        </div>

        {override && (
          <div className="flex items-center gap-2 rounded-xl bg-pwd-chakra/10 px-3 py-2 text-xs text-pwd-chakra">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            {t('demoOverrideActive')}
          </div>
        )}

        <div className={`rounded-2xl p-5 text-center ${effectiveOnSite ? 'bg-green-50' : 'bg-amber-50'}`}>
          {!pos && !geoError && !override && (
            <div className="flex flex-col items-center gap-2 py-4 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-pwd-green" />
              <p className="text-sm">{t('locatingYou')}</p>
            </div>
          )}
          {!pos && !geoError && override && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <p className="mt-3 text-lg font-bold text-green-700">{t('readyToCapture')}</p>
              <p className="mt-1 text-xs text-slate-500">{t('usingSiteLocation')}</p>
            </>
          )}
          {geoError && !override && (
            <div className="flex flex-col items-center gap-2 py-4 text-amber-700">
              <AlertTriangle className="h-8 w-8" />
              <p className="text-sm">{geoError}</p>
            </div>
          )}
          {pos && (
            <>
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${effectiveOnSite ? 'bg-green-500' : 'bg-amber-500'} text-white`}>
                {effectiveOnSite ? <CheckCircle2 className="h-8 w-8" /> : <Navigation className="h-8 w-8" />}
              </div>
              <p className={`mt-3 text-lg font-bold ${effectiveOnSite ? 'text-green-700' : 'text-amber-700'}`}>
                {effectiveOnSite ? t('youAreOnSite') : t('notAtSite')}
              </p>
              {distance != null && (
                <p className="mt-1 text-sm text-slate-600">
                  {distance < 1000
                    ? `${Math.round(distance)} m ${t('fromSite')}`
                    : `${(distance / 1000).toFixed(1)} km ${t('fromSite')}`}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                <Crosshair className="mr-1 inline h-3 w-3" />
                {t('accuracy')}: ±{Math.round(pos.accuracy)} m
              </p>
            </>
          )}
        </div>

        {!effectiveOnSite && pos && <p className="text-center text-xs text-amber-700">{t('mustBeWithin', { m: ON_SITE_RADIUS_M })}</p>}

        <button
          disabled={!effectiveOnSite}
          onClick={() => setStep('capture')}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Camera className="mr-2 h-4 w-4" /> {t('openCamera')}
        </button>
        {!effectiveOnSite && pos && (
          <button onClick={() => setStep('capture')} className="w-full text-center text-xs text-slate-400 underline">
            {t('captureAnyway')}
          </button>
        )}
      </div>
    );
  }

  if (step === 'capture') {
    return (
      <div className="flex h-full flex-col bg-black">
        <div className="relative flex-1">
          {camError ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center text-white">
              <AlertTriangle className="h-10 w-10 text-amber-400" />
              <p className="text-sm">{camError}</p>
              <label className="btn-primary cursor-pointer">
                {t('useDeviceCamera')}
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFilePick} />
              </label>
            </div>
          ) : (
            <>
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
              <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[11px] text-white">
                <MapPin className="mr-1 inline h-3 w-3" />
                {effectivePos ? `${effectivePos.lat.toFixed(5)}, ${effectivePos.lng.toFixed(5)}` : t('locatingYou')}
                {effectiveOnSite ? ' · ON-SITE' : ' · OFF-SITE'}{override ? ' (DEMO)' : ''}
              </div>
            </>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
        {!camError && (
          <div className="flex items-center justify-between gap-4 bg-black px-6 py-5">
            <button onClick={() => setStep('locate')} className="text-sm text-white/70">{t('back')}</button>
            <button
              onClick={stampAndCapture}
              className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/20"
              aria-label={t('capture')}
            >
              <Camera className="h-7 w-7 text-white" />
            </button>
            <span className="w-10" />
          </div>
        )}
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="space-y-4 p-4">
        <h1 className="text-lg font-bold text-pwd-ink">{t('recordProgress')}</h1>
        {photo && <img src={photo} alt="capture" className="w-full rounded-xl object-cover" />}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${effectiveOnSite ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            <MapPin className="h-3 w-3" /> {effectiveOnSite ? t('onSite') : t('offSite')}
            {effectiveDistance != null && ` · ${Math.round(effectiveDistance)}m`}
            {override ? ' · DEMO' : ''}
          </span>
          <button onClick={() => setStep('capture')} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600">
            <RefreshCw className="h-3 w-3" /> {t('retake')}
          </button>
        </div>

        <div>
          <label className="label">{t('completionPercent')}: {percent}%</label>
          <input type="range" min={0} max={100} value={percent} onChange={(e) => setPercent(Number(e.target.value))} className="w-full accent-pwd-green" />
          <div className="mt-1"><ProgressBar percent={percent} /></div>
        </div>
        <div>
          <label className="label">{t('milestone')}</label>
          <input className="input" value={milestone} onChange={(e) => setMilestone(e.target.value)} placeholder={t('milestonePlaceholder')} />
        </div>
        <div>
          <label className="label">{t('updateMessage')}</label>
          <textarea className="input" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t('updateMessagePlaceholder')} />
        </div>
        <button onClick={submit} className="btn-primary w-full">{t('submitProgress')}</button>
      </div>
    );
  }

  // done
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-xl font-bold text-pwd-ink">{t('progressRecorded')}</h1>
      <p className="text-sm text-slate-500">{t('progressRecordedHint')}</p>
      <div className="flex w-full flex-col gap-2 pt-2">
        <button onClick={() => project && navigate(`/app/projects/${project.id}`)} className="btn-primary w-full">
          {t('viewProject')}
        </button>
        <button
          onClick={() => {
            setProject(null);
            setPos(null);
            setPhoto(null);
            setPercent(0);
            setMilestone('');
            setMessage('');
            setStep('select');
          }}
          className="btn-secondary w-full"
        >
          {t('captureAnother')}
        </button>
      </div>
    </div>
  );
}
