import { useState, useTransition } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { loginAction } from '@/app/(frontend)/actions';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSignIn = () => {
    setError('');
    startTransition(async () => {
      const result = await loginAction(form);
      if (!result.ok || !result.data) {
        setError(result.ok ? 'No pudimos iniciar sesión.' : result.error);
        return;
      }
      signIn(result.data);
      const returnTo = (location.state as { from?: string } | null)?.from;
      const destination = result.data.role === 'institution' ? '/shelter-dashboard' : (returnTo || '/inicio');
      navigate(destination, { replace: true });
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Bienvenido de vuelta</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            Ingresá a tu cuenta de Search Animal
          </p>
        </div>

        <div className="rounded-2xl border p-8" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-600 mb-1.5">Correo electrónico</label>
              <input
                type="text"
                value={form.email}
                onChange={e => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-600 text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleSignIn}
            disabled={isPending}
            className="w-full mt-5 py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isPending ? 'Ingresando…' : 'Ingresar'}
          </button>

          <div className="mt-4 text-center">
            <Link to="/register" className="text-sm font-600" style={{ color: 'var(--color-primary)' }}>
              ¿No tenés cuenta? Registrate
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link to="/register-institution" className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            ¿Sos un refugio o veterinaria? Registro institucional →
          </Link>
        </div>
      </div>
    </div>
  );
}
