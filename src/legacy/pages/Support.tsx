import { useState } from 'react';

const categories = [
  'Problema con publicación',
  'Error en el mapa',
  'Cuenta suspendida',
  'Solicitud de eliminación',
  'Consulta general',
  'Reporte de usuario',
  'Otro',
];

export default function Support() {
  const [form, setForm] = useState({ subject: '', category: '', description: '' });
  const [file, setFile] = useState<File | null>(null);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-700 mb-3" style={{ fontFamily: 'var(--font-display)' }}>¡Ticket enviado!</h1>
        <p style={{ color: 'var(--color-muted-foreground)' }}>
          Recibirás una respuesta en tu correo en 24–48 hs hábiles.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-6 px-5 py-2.5 rounded-xl font-600 text-white"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Nuevo ticket
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-7">
        <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Soporte y reclamos</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          ¿Tenés un problema o consulta? Completá el formulario y te respondemos por email.
        </p>
      </div>

      <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div>
          <label className="block text-sm font-600 mb-1.5">Asunto *</label>
          <input
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
            placeholder="Resumen del problema"
          />
        </div>

        <div>
          <label className="block text-sm font-600 mb-1.5">Categoría *</label>
          <select
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none cursor-pointer"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
          >
            <option value="">Seleccioná una categoría</option>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-600 mb-1.5">Descripción *</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            rows={5}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
            placeholder="Describí el problema con el mayor detalle posible. Incluí capturas de pantalla si aplica."
          />
        </div>

        <div>
          <label className="block text-sm font-600 mb-2">Adjuntar archivo (opcional)</label>
          <label
            className="flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-orange-400 transition-all"
            style={{ borderColor: file ? 'var(--color-primary)' : 'var(--color-border)' }}
          >
            <input type="file" className="hidden" onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
            <span className="text-2xl">{file ? '📎' : '📁'}</span>
            <div>
              <div className="text-sm font-600">{file ? file.name : 'Seleccionar archivo'}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>PNG, JPG, PDF — hasta 20 MB</div>
            </div>
          </label>
        </div>

        <button
          onClick={() => setSent(true)}
          className="w-full py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          💬 Enviar ticket de soporte
        </button>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="text-lg font-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Preguntas frecuentes</h2>
        {[
          { q: '¿Cuánto tarda en aparecer mi publicación?', a: 'Las publicaciones se aprueban automáticamente y aparecen en tiempo real.' },
          { q: '¿Cómo funciona el matching?', a: 'El algoritmo cruza especie, raza, color, tamaño y ubicación para calcular un score de coincidencia.' },
          { q: '¿Es gratuito?', a: 'Sí, totalmente gratuito para usuarios individuales. Los refugios tienen planes institucionales.' },
        ].map((faq, i) => (
          <div key={i} className="border-b py-4" style={{ borderColor: 'var(--color-border)' }}>
            <div className="font-600 text-sm mb-1">{faq.q}</div>
            <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{faq.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
