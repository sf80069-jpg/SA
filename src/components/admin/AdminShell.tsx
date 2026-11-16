'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

const navItems = [
  { href: '/admin-panel/dashboard', label: 'Dashboard' },
  { href: '/admin-panel/moderation', label: 'Moderación' },
  { href: '/admin-panel/users', label: 'Usuarios' },
  { href: '/admin-panel/petitions', label: 'Solicitudes' },
];

export function AdminShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('search-animal-admin-session') === 'active';
    if (!isAuthenticated && pathname !== '/admin-panel') {
      router.replace('/admin-panel');
      return;
    }
    setReady(true);
  }, [pathname, router]);

  const activeTab = useMemo(() => {
    const match = navItems.find((item) => pathname.startsWith(item.href));
    return match?.href ?? '/admin-panel/dashboard';
  }, [pathname]);

  const signOut = () => {
    localStorage.removeItem('search-animal-admin-session');
    router.replace('/admin-panel');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-sm text-slate-300">Validando sesión de administrador…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-72 flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/40 lg:flex">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-bold text-white">SA</div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</div>
                <div className="text-lg font-bold text-white">Search Animal</div>
              </div>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = item.href === activeTab;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    active ? 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/40' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                  <span className="text-xs text-slate-500">→</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Sesión</div>
            <div className="mt-2 text-sm font-medium text-slate-200">admin</div>
            <button
              type="button"
              onClick={signOut}
              className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300"
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 rounded-2xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/20">
          <header className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Panel administrativo</div>
              <h1 className="mt-1 text-2xl font-bold text-white">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Sistema activo
              </div>
              <button
                type="button"
                onClick={signOut}
                className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 transition hover:border-orange-500/60 hover:text-orange-300 lg:hidden"
              >
                Salir
              </button>
            </div>
          </header>

          <div className="border-b border-slate-800 px-5 py-3 text-sm text-slate-400">{subtitle}</div>
          <div className="p-5">{children}</div>
        </main>
      </div>
    </div>
  );
}
