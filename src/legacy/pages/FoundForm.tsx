import { useState, useTransition } from 'react';
import { Link } from 'react-router';
import { useRouter } from 'next/navigation';
import { createPublicationAction } from '@/app/(frontend)/actions';

const species = ['Perro', 'Gato', 'Conejo', 'Ave', 'Roedor', 'Reptil', 'Otro'];
const sizes = ['Pequeño (< 5 kg)', 'Mediano (5–20 kg)', 'Grande (> 20 kg)'];
const genders = ['Macho', 'Hembra', 'Desconocido'];

export default function FoundForm() {
  const [form, setForm] = useState({
    species: '', breed: '', size: '', gender: '',
    characteristics: '', comments: '', radius: 3,
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const publish = () => {
    setResult(null);
    startTransition(async () => {
      const photoData = photo ? await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(new Error('No se pudo procesar la foto.'));
        reader.readAsDataURL(photo);
      }) : undefined;

      const response = await createPublicationAction({
        breed: form.breed,
        characteristics: form.characteristics,
        comments: form.comments,
        gender: form.gender,
        name: 'Sin nombre',
        photo: photoData,
        radius: form.radius,
        size: form.size,
        species: form.species,
        type: 'found',
      });
      if (!response.ok) {
        setResult({ success: false, message: response.error });
        return;
      }
      setResult({ success: true, message: '¡Publicación exitosa! El hallazgo ya aparece en tu actividad.' });
      setForm({
        species: '', breed: '', size: '', gender: '',
        characteristics: '', comments: '', radius: 3,
      });
      setPhoto(null);
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none";
  const inputStyle = { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-700 mb-3 text-white" style={{ backgroundColor: '#10B981' }}>
          🐾 MASCOTA ENCONTRADA
        </div>
        <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>¿Encontraste una mascota?</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Reportá el hallazgo para encontrar a su dueño. Tu ubicación se capturará automáticamente.
        </p>
      </div>

      {result && (
        <div
          className={`mb-5 rounded-2xl border p-4 ${result.success ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-red-200 bg-red-50 text-red-800'}`}
          role="status"
        >
          <p className="font-700">{result.message}</p>
          {result.success && (
            <Link to="/profile" className="mt-2 inline-block text-sm font-700 underline">
              Ver en Mis publicaciones →
            </Link>
          )}
        </div>
      )}

      <div className="rounded-2xl border p-6 flex flex-col gap-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        {/* Animal data */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Descripción del animal</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-600 mb-1.5">Especie *</label>
              <select value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} className={inputClass + ' cursor-pointer'} style={inputStyle}>
                <option value="">Seleccioná</option>
                {species.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Raza estimada</label>
              <input value={form.breed} onChange={e => setForm((prev) => ({ ...prev, breed: e.target.value }))} className={inputClass} style={inputStyle} placeholder="Mestizo / Desconocido" />
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Tamaño *</label>
              <select value={form.size} onChange={e => setForm({ ...form, size: e.target.value })} className={inputClass + ' cursor-pointer'} style={inputStyle}>
                <option value="">Seleccioná</option>
                {sizes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Género aparente</label>
              <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={inputClass + ' cursor-pointer'} style={inputStyle}>
                <option value="">Seleccioná</option>
                {genders.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-600 mb-1.5">Características físicas observables</label>
            <textarea
              value={form.characteristics}
              onChange={e => setForm((prev) => ({ ...prev, characteristics: e.target.value }))}
              rows={2}
              className={inputClass}
              style={inputStyle}
              placeholder="Color, marcas, collar, chip visible..."
            />
          </div>
        </div>

        {/* Photo */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Fotografía del hallazgo</p>
          <label
            className="flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:border-emerald-400 transition-all"
            style={{ borderColor: photo ? '#10B981' : 'var(--color-border)', backgroundColor: photo ? '#F0FDF4' : 'transparent' }}
          >
            <input type="file" accept="image/jpeg,image/jpg" className="hidden" onChange={e => e.target.files?.[0] && setPhoto(e.target.files[0])} />
            <div className="text-3xl">{photo ? '✅' : '📷'}</div>
            <div className="text-sm font-600">{photo ? photo.name : 'Adjuntar foto (JPG)'}</div>
          </label>
        </div>

        {/* Geolocation */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Ubicación del hallazgo</p>
          <div className="flex items-center gap-2 p-3 rounded-xl border mb-3" style={{ borderColor: '#BBF7D0', backgroundColor: '#F0FDF4' }}>
            <span className="text-xl">📍</span>
            <div>
              <div className="text-sm font-600" style={{ color: '#065F46' }}>Ubicación capturada automáticamente</div>
              <div className="text-xs" style={{ color: '#6EE7B7' }}>Lat: -34.603722 · Lon: -58.381592</div>
            </div>
            <button className="ml-auto text-xs font-600 px-2 py-1 rounded-lg" style={{ backgroundColor: '#10B981', color: 'white' }}>Ajustar pin</button>
          </div>
          <div>
            <label className="block text-sm font-600 mb-1.5">Radio de coincidencia: <span style={{ color: '#10B981' }}>{form.radius} km</span></label>
            <input type="range" min={1} max={10} value={form.radius} onChange={e => setForm({ ...form, radius: +e.target.value })} className="w-full" style={{ accentColor: '#10B981' }} />
          </div>
        </div>

        {/* Comments */}
        <div>
          <label className="block text-sm font-600 mb-1.5">Estado del animal y comentarios</label>
          <textarea
            value={form.comments}
            onChange={e => setForm((prev) => ({ ...prev, comments: e.target.value }))}
            rows={3}
            className={inputClass}
            style={inputStyle}
            placeholder="¿Cómo lo encontraste? ¿Está asustado, herido, con collar? ¿Dónde está ahora?"
          />
        </div>

        <button
          type="button"
          onClick={publish}
          disabled={isPending}
          className="w-full py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#10B981' }}
        >
          {isPending ? 'Publicando…' : '🐾 Publicar hallazgo'}
        </button>
      </div>
    </div>
  );
}
