import { useState, useTransition } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { registerInstitutionAction } from '@/app/(frontend)/actions';

export default function RegisterInstitution() {
  const [form, setForm] = useState({
    name: 'Refugio Luna',
    address: 'Av. Santa Fe 1234, CABA',
    phone: '+54 11 4567-8899',
    email: 'luna99@gmail.com',
    password: 'refugio999',
    confirm: 'refugio999',
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(true);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleRegisterInstitution = () => {
    setError('');

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!agreed) {
      setError('Debés aceptar la declaración institucional para continuar.');
      return;
    }

    startTransition(async () => {
      const result = await registerInstitutionAction({
        address: form.address,
        email: form.email,
        institutionName: form.name,
        password: form.password,
        phone: form.phone,
      });

      if (!result.ok || !result.data) {
        setError(result.ok ? 'No pudimos crear el refugio institucional.' : result.error);
        return;
      }

      signIn(result.data);
      navigate('/shelter-dashboard');
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-700 mb-4" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
            🏠 REGISTRO INSTITUCIONAL
          </div>
          <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Registro para refugios y veterinarias</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            Accedé a las herramientas profesionales de gestión de animales albergados.
          </p>
        </div>

        <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div>
            <label className="block text-sm font-600 mb-1.5">Nombre de la institución / veterinaria *</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="Refugio Amigos del Alma"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Dirección física pública *</label>
            <input
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="Av. Rivadavia 5500, CABA"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Teléfono de contacto *</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="+54 11 5555-6789"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Correo institucional</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="refugio@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Contraseña institucional</label>
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

          <div>
            <label className="block text-sm font-600 mb-2">Logo de la institución</label>
            <label
              className="flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-all"
              style={{ borderColor: logo ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: logo ? '#FFF7ED' : 'transparent' }}
            >
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && setLogo(e.target.files[0])} />
              <span className="text-2xl">{logo ? '✅' : '🖼️'}</span>
              <div>
                <div className="text-sm font-600">{logo ? logo.name : 'Subir logo'}</div>
                <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>PNG, SVG — fondo transparente recomendado</div>
              </div>
            </label>
          </div>

          <label
            className="flex items-start gap-3 p-4 rounded-xl cursor-pointer"
            style={{ backgroundColor: 'var(--color-muted)' }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-orange-500"
            />
            <p className="text-sm" style={{ color: 'var(--color-foreground)' }}>
              Declaro que represento a un refugio, organización o veterinaria legítima y acepto las condiciones de uso institucional de la plataforma Search Animal.
            </p>
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-600 text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            onClick={handleRegisterInstitution}
            disabled={isPending}
            className="w-full py-3 rounded-xl font-700 text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {isPending ? 'Creando refugio…' : 'Enviar solicitud de registro'}
          </button>

          <p className="text-xs text-center" style={{ color: 'var(--color-muted-foreground)' }}>
            El equipo de Search Animal revisará tu solicitud y te contactará en 48–72 hs.
          </p>
        </div>
      </div>
    </div>
  );
}
