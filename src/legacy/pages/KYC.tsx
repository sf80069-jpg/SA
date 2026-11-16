import { useState } from 'react';
import { Link } from 'react-router';

export default function KYC() {
  const [form, setForm] = useState({ name: '', dni: '', address: '', phone: '' });
  const [dniFile, setDniFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const UploadBox = ({
    label, icon, file, onFile
  }: { label: string; icon: string; file: File | null; onFile: (f: File) => void }) => (
    <label
      className="flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:border-orange-400 transition-all"
      style={{ borderColor: file ? 'var(--color-primary)' : 'var(--color-border)', backgroundColor: file ? '#FFF7ED' : 'var(--color-background)' }}
    >
      <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} />
      <div className="text-3xl">{file ? '✅' : icon}</div>
      <div className="text-sm font-600 text-center">{file ? file.name : label}</div>
      {!file && <div className="text-xs text-center" style={{ color: 'var(--color-muted-foreground)' }}>JPG, PNG — hasta 10 MB</div>}
    </label>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-700" style={{ backgroundColor: 'var(--color-primary)' }}>2</div>
            <span className="text-sm font-600" style={{ color: 'var(--color-muted-foreground)' }}>Validación de identidad · KYC</span>
          </div>
          <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Verificá tu identidad</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
            Este paso protege a la comunidad. Tus datos son tratados con confidencialidad.
          </p>
        </div>

        <div className="rounded-2xl border p-6 flex flex-col gap-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-600 mb-1.5">Nombre y Apellido *</label>
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                placeholder="María García"
              />
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">DNI *</label>
              <input
                value={form.dni}
                onChange={e => setForm({ ...form, dni: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                placeholder="38.450.123"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Dirección *</label>
            <input
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="Av. Corrientes 1234, CABA"
            />
          </div>

          <div>
            <label className="block text-sm font-600 mb-1.5">Teléfono *</label>
            <input
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
              placeholder="+54 11 1234-5678"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <p className="text-sm font-600 mb-2">Escaneo de DNI *</p>
              <UploadBox label="Subir frente del DNI" icon="🪪" file={dniFile} onFile={setDniFile} />
            </div>
            <div>
              <p className="text-sm font-600 mb-2">Selfie (foto frontal) *</p>
              <UploadBox label="Subir foto actual" icon="🤳" file={selfieFile} onFile={setSelfieFile} />
            </div>
          </div>

          <p className="text-xs p-3 rounded-xl" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
            🔒 Tu selfie y DNI se comparan biométricamente para garantizar la autenticidad. No se almacenan las imágenes crudas.
          </p>

          <button
            className="w-full py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Continuar con el registro →
          </button>
        </div>
      </div>
    </div>
  );
}
