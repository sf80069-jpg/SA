'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'searchanimal18';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState(ADMIN_USERNAME);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const normalizedUser = username.trim();
    const valid = normalizedUser === ADMIN_USERNAME && password === ADMIN_PASSWORD;

    if (!valid) {
      setError('Credenciales inválidas. El administrador es admin / searchanimal18.');
      return;
    }

    localStorage.setItem('search-animal-admin-session', 'active');
    router.push('/admin-panel/dashboard');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b,_#020617_50%)] px-4 py-10 text-slate-100">
      <div className="mx-auto max-w-md rounded-3xl border border-slate-700 bg-slate-900/85 p-7 shadow-2xl shadow-slate-950/60 backdrop-blur-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-bold text-white">SA</div>
          <h1 className="mt-5 text-3xl font-bold">Acceso administrativo</h1>
          <p className="mt-2 text-sm text-slate-400">Panel de moderación y gestión de Search Animal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-300">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-orange-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none ring-0 transition focus:border-orange-500"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            Ingresar al panel
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
          <div className="font-medium text-slate-300">Credenciales de demo</div>
          <div className="mt-1">Usuario: admin</div>
          <div>Contraseña: searchanimal18</div>
        </div>
      </div>
    </div>
  );
}
