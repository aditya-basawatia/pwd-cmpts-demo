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

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-2xl font-bold text-pwd-navy mb-6">{t('howItWorks')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: '1', title: t('step1'), icon: Search },
            { step: '2', title: t('step2'), icon: MessageSquarePlus },
            { step: '3', title: t('step3'), icon: MapPin },
          ].map((item) => (
            <div key={item.step} className="card">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pwd-navy text-white font-bold mb-3">
                {item.step}
              </div>
              <item.icon className="h-6 w-6 text-pwd-gold mb-2" />
              <p className="font-medium">{item.title}</p>
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
