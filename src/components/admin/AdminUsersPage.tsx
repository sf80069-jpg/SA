'use client';

import { useMemo, useState } from 'react';
import { users } from './admin-data';
import { AdminShell } from './AdminShell';

export default function AdminUsersPage() {
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return users;

    return users.filter((user) => `${user.name} ${user.email} ${user.region}`.toLowerCase().includes(normalized));
  }, [query]);

  return (
    <AdminShell title="Usuarios" subtitle="Búsqueda global de usuarios, score y acciones de penalización.">
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-lg font-semibold text-white">Buscador global</div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar nombre, email o zona..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none transition focus:border-orange-500 md:max-w-md"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-300">
              <tr>
                <th className="px-3 py-2">Usuario</th>
                <th className="px-3 py-2">Zona</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Penalizaciones</th>
                <th className="px-3 py-2">Última actividad</th>
                <th className="px-3 py-2">Estado</th>
                <th className="px-3 py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-800 bg-slate-950/40">
                  <td className="px-3 py-3">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{user.region}</td>
                  <td className="px-3 py-3 text-slate-300">{user.score}</td>
                  <td className="px-3 py-3 text-slate-300">{user.penalties}</td>
                  <td className="px-3 py-3 text-slate-300">{user.lastActive}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2 py-1 text-[11px] ${
                      user.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-300' : user.status === 'Advertido' ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-300'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-200">Advertir</button>
                      <button className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-[11px] font-medium text-rose-200">Suspender</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
