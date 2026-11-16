import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { registerAction } from '@/app/(frontend)/actions';

const avatars = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🦁', '🐯', '🐮', '🐸', '🐺'];

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '', confirm: '' });
  const [avatar, setAvatar] = useState('🐶');
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleCreateAccount = () => {
    setError('');
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    startTransition(async () => {
      const result = await registerAction({
        avatar,
        email: form.email,
        password: form.password,
        username: form.username,
      });
      if (!result.ok || !result.data) {
        setError(result.ok ? 'No pudimos crear la cuenta.' : result.error);
        return;
      }
      signIn(result.data);
      navigate(result.data.role === 'institution' ? '/shelter-dashboard' : '/inicio');
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-700" style={{ backgroundColor: 'var(--color-primary)' }}>3</div>
            <span className="text-sm font-600" style={{ color: 'var(--color-muted-foreground)' }}>Registro de cuenta</span>
          </div>
          <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Creá tu cuenta</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>Elegí un nombre de usuario, contraseña y avatar.</p>
        </div>

        <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          {/* Avatar selector */}
          <div>
            <label className="block text-sm font-600 mb-1.5">Correo electrónico</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <p className="text-sm font-600 mb-2">Tu avatar</p>
            <div className="flex flex-wrap gap-2">
              {avatars.map(av => (
                <button
                  key={av}
                  onClick={() => setAvatar(av)}
                  className="text-2xl w-11 h-11 rounded-xl border-2 transition-all flex items-center justify-center"
                  style={{
                    borderColor: avatar === av ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: avatar === av ? '#FFF7ED' : 'transparent',
                  }}
                >
                  {av}
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl border flex items-center justify-center text-4xl" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-muted)' }}>
                {avatar}
              </div>
              <span className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Avatar seleccionado</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Nombre de usuario</label>
            <input
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="searchanimal_user123"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-600 text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleCreateAccount}
            disabled={isPending}
            className="w-full mt-2 py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isPending ? 'Creando cuenta…' : 'Crear cuenta ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}
