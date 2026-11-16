'use client';

import { petitions } from './admin-data';
import { AdminShell } from './AdminShell';

export default function AdminPetitionsPage() {
  return (
    <AdminShell title="Solicitudes" subtitle="Bandeja de voluntarios con aprobación, rechazo o revisión manual.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {petitions.map((petition) => (
          <div key={petition.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold text-white">{petition.name}</div>
                <div className="text-sm text-slate-400">{petition.specialty}</div>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] ${
                petition.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-300' : petition.status === 'Rechazado' ? 'bg-rose-500/10 text-rose-300' : 'bg-sky-500/10 text-sky-300'
              }`}>
                {petition.status}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-slate-300">
              <div><span className="text-slate-500">Zona:</span> {petition.region}</div>
              <div><span className="text-slate-500">Disponibilidad:</span> {petition.availability}</div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-300">
              {petition.message}
            </div>

            {petition.status === 'Pendiente' ? (
              <div className="mt-4 flex gap-2">
                <button type="button" className="flex-1 rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
                  Aprobar
                </button>
                <button type="button" className="flex-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20">
                  Rechazar
                </button>
              </div>
            ) : (
              <div className="mt-4 text-xs text-slate-500">Solicitud {petition.status.toLowerCase()} y lista para revisión final.</div>
            )}
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
