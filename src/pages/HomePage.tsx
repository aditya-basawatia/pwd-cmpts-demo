import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, MessageSquarePlus, MapPin } from 'lucide-react';
import { useStore } from '@/hooks/useStore';
import { ProgressBar } from '@/components/Badges';
import { AshokaChakra } from '@/components/Indic';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { projects, complaints, divisions } = useStore();
  const isHi = i18n.language === 'hi';
  const active = projects.filter((p) => p.status === 'in_progress').length;
  const resolved = complaints.filter((c) => ['resolved', 'closed'].includes(c.status)).length;

  return (
    <div>
      <section className="relative overflow-hidden bg-gov-green text-white">
        <AshokaChakra
          className="pointer-events-none absolute -right-16 top-1/2 hidden h-96 w-96 -translate-y-1/2 opacity-10 md:block"
          color="#ffffff"
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-pwd-gold text-sm font-medium mb-2">{t('govt')} · {t('dept')}</p>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">{t('heroTitle')}</h1>
            <p className="text-lg text-white/80 mb-8">{t('heroSubtitle')}</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/projects" className="btn-primary !bg-pwd-gold !text-pwd-ink font-semibold hover:!bg-pwd-gold/90">
                {t('browseProjects')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link to="/lodge" className="btn-secondary">
                <MessageSquarePlus className="mr-2 h-4 w-4" /> {t('lodgeComplaint')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t('statsProjects'), value: active, color: 'text-pwd-saffron', bar: 'bg-pwd-saffron' },
            { label: t('statsComplaints'), value: resolved, color: 'text-pwd-green', bar: 'bg-pwd-green' },
            { label: t('statsDivisions'), value: divisions.length, color: 'text-pwd-chakra', bar: 'bg-pwd-chakra' },
          ].map((s) => (
            <div key={s.label} className="card text-center relative overflow-hidden">
              <div className={`absolute inset-x-0 top-0 h-1 ${s.bar}`} />
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-sm text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-pwd-green">{t('howItWorks')}</h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-pwd-gold" />
        </div>
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* connector line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-pwd-greenLight md:block" />
          {[
            { step: '1', title: t('step1'), desc: t('step1Desc'), icon: Search },
            { step: '2', title: t('step2'), desc: t('step2Desc'), icon: MessageSquarePlus },
            { step: '3', title: t('step3'), desc: t('step3Desc'), icon: MapPin },
          ].map((item) => (
            <div key={item.step} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-pwd-green text-white shadow-md">
                <item.icon className="h-7 w-7" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pwd-gold text-xs font-bold text-pwd-ink ring-2 ring-white">
                  {item.step}
                </span>
              </div>
              <p className="text-lg font-semibold text-pwd-ink">{item.title}</p>
              <p className="mt-2 max-w-xs text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-pwd-green">{t('projects')}</h2>
            <Link to="/projects" className="text-pwd-green text-sm font-medium hover:underline">
              {t('viewAll')} →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((p) => {
              const div = divisions.find((d) => d.id === p.divisionId);
              return (
                <Link key={p.id} to={`/projects/${p.id}`} className="card hover:shadow-md transition group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-pwd-navy group-hover:text-pwd-gold transition">
                      {isHi ? p.nameHi : p.name}
                    </h3>
                    <span className="text-xs bg-slate-100 rounded px-2 py-0.5 capitalize">{p.type}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{isHi ? div?.nameHi : div?.name} · {isHi ? p.locationHi : p.location}</p>
                  <ProgressBar percent={p.completionPercent} />
                  <p className="text-xs text-slate-500 mt-1">{p.completionPercent}% {t('progress')}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
