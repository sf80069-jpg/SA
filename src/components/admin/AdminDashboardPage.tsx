'use client';

import { activity, alerts, metrics } from './admin-data';
import { AdminShell } from './AdminShell';

const toneMap = {
  rose: 'bg-rose-500/10 text-rose-300 ring-1 ring-inset ring-rose-500/20',
  amber: 'bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-500/20',
  sky: 'bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/20',
};

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard" subtitle="Resumen operativo, alertas y actividad reciente en tiempo real.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="text-sm text-slate-400">{metric.label}</div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <div className="text-3xl font-bold text-white">{metric.value}</div>
              <span className={`rounded-full px-2 py-1 text-xs ${toneMap[metric.tone]}`}>{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Alertas prioritarias</h2>
            <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-300">Tiempo real</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{alert.title}</div>
                    <div className="mt-1 text-sm text-slate-400">{alert.detail}</div>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                    alert.severity === 'Alta' ? 'bg-rose-500/10 text-rose-300' : alert.severity === 'Media' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <div className="mt-3 text-xs text-slate-500">{alert.time}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Actividad reciente</h2>
            <span className="text-xs text-slate-500">Live</span>
          </div>

          <div className="space-y-3">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className={`mt-1 h-2.5 w-2.5 rounded-full ${
                  item.status === 'ok' ? 'bg-emerald-400' : item.status === 'warn' ? 'bg-amber-400' : 'bg-sky-400'
                }`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white">{item.actor}</div>
                  <div className="text-sm text-slate-400">{item.action}</div>
                  <div className="mt-1 text-xs text-slate-500">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
