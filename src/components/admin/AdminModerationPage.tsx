'use client';

import { useState } from 'react';
import { reports } from './admin-data';
import { AdminShell } from './AdminShell';

export default function AdminModerationPage() {
  const [selectedId, setSelectedId] = useState(reports[0]?.id ?? '');

  const selectedReport = reports.find((report) => report.id === selectedId) ?? reports[0];

  return (
    <AdminShell title="Moderación" subtitle="Revisión de reportes, datos ocultos y coordenadas exactas por zona.">
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Grilla de reportes</h2>
            <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{reports.length} registros</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Zona</th>
                  <th className="px-3 py-2">Riesgo</th>
                  <th className="px-3 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedId(report.id)}
                    className={`cursor-pointer border-t border-slate-800 transition ${
                      selectedReport?.id === report.id ? 'bg-orange-500/10' : 'bg-slate-950/40 hover:bg-slate-900'
                    }`}
                  >
                    <td className="px-3 py-3 font-medium text-white">{report.id}</td>
                    <td className="px-3 py-3 text-slate-300">{report.type}</td>
                    <td className="px-3 py-3 text-slate-300">{report.zone}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-[11px] ${
                        report.risk === 'Alta' ? 'bg-rose-500/10 text-rose-300' : report.risk === 'Media' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'
                      }`}>
                        {report.risk}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full px-2 py-1 text-[11px] ${
                        report.status === 'Pendiente' ? 'bg-sky-500/10 text-sky-300' : report.status === 'Revisado' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Visor de datos ocultos</h2>
            <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-1 text-xs text-orange-200">Revisión manual</span>
          </div>

          {selectedReport ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Reportero</div>
                <div className="mt-2 text-base font-semibold text-white">{selectedReport.petitioner}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Datos ocultos</div>
                <div className="mt-2 text-sm leading-6 text-slate-200">{selectedReport.hiddenData}</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Coordenadas exactas</div>
                <div className="mt-2 text-base font-medium text-white">{selectedReport.exactCoords}</div>
                <div className="mt-3 h-40 rounded-xl bg-[radial-gradient(circle_at_center,_rgba(249,115,22,0.26),_rgba(15,23,42,0.2)_58%,_rgba(15,23,42,0.8)),linear-gradient(135deg,#0f172a,#111827)] p-3">
                  <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-700 text-xs text-slate-300">
                    Mapa de ubicación exacta • lat/lng: {selectedReport.exactCoords}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" className="flex-1 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                  Resolver
                </button>
                <button type="button" className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20">
                  Bloquear
                </button>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-400">Selecciona un reporte para revisar.</div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
