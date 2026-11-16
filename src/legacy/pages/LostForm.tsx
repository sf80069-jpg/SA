import { useEffect, useRef, useState, useTransition } from 'react';
import { Link } from 'react-router';
import { useRouter } from 'next/navigation';
import { createPublicationAction } from '@/app/(frontend)/actions';
import { mapCoordinatesToPercent } from '@/lib/map-coordinates';

const species = ['Perro', 'Gato', 'Conejo', 'Ave', 'Roedor', 'Reptil', 'Otro'];
const sizes = ['Pequeño (< 5 kg)', 'Mediano (5–20 kg)', 'Grande (> 20 kg)'];
const genders = ['Macho', 'Hembra', 'Desconocido'];

export default function LostForm() {
  const [form, setForm] = useState({
    name: '', species: '', breed: '', size: '', gender: '',
    characteristics: '', hiddenClue: '', radius: 2,
  });
  const [zoneName, setZoneName] = useState('Buenos Aires, Argentina');
  const [location, setLocation] = useState({ x: 52, y: 52 });
  const [photo, setPhoto] = useState<File | null>(null);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const geocodeTimeoutRef = useRef<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    let disposed = false;
    let map: import('leaflet').Map | null = null;
    let marker: import('leaflet').CircleMarker | null = null;

    const initializeMap = async () => {
      const L = await import('leaflet');
      const mapRoot = mapContainerRef.current;
      if (disposed || !mapRoot) return;

      map = L.map(mapRoot, { zoomControl: true }).setView([-34.6037, -58.3816], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      marker = L.circleMarker([-34.6037, -58.3816], {
        radius: 9,
        color: '#ffffff',
        weight: 3,
        fillColor: '#EF4444',
        fillOpacity: 1,
      }).addTo(map);

      map.on('click', ({ latlng }) => {
        marker?.setLatLng(latlng);
        setLocation(mapCoordinatesToPercent(latlng.lat, latlng.lng));
        setMapError(null);

        if (geocodeTimeoutRef.current !== null) {
          window.clearTimeout(geocodeTimeoutRef.current);
        }

        geocodeTimeoutRef.current = window.setTimeout(async () => {
          try {
            const query = new URLSearchParams({
              format: 'jsonv2',
              lat: String(latlng.lat),
              lon: String(latlng.lng),
              zoom: '16',
              addressdetails: '1',
              'accept-language': 'es',
            });
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${query}`);
            if (!response.ok) throw new Error('No se pudo consultar la dirección.');
            const result = await response.json();
            const address = result.address || {};
            const zone = address.suburb || address.neighbourhood || address.city_district || address.city || result.display_name;
            if (zone) setZoneName(zone);
          } catch {
            setMapError('No se pudo identificar el barrio. Podés escribirlo en el campo de ubicación.');
          }
        }, 1100);
      });

      setIsMapReady(true);
    };

    void initializeMap().catch(() => {
      if (!disposed) setMapError('No se pudo cargar OpenStreetMap. Revisá tu conexión e intentá nuevamente.');
    });

    return () => {
      disposed = true;
      if (geocodeTimeoutRef.current !== null) window.clearTimeout(geocodeTimeoutRef.current);
      map?.remove();
    };
  }, []);

  const publish = async () => {
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
        gender: form.gender,
        hiddenClue: form.hiddenClue,
        locationX: location.x,
        locationY: location.y,
        name: form.name,
        photo: photoData,
        radius: form.radius,
        size: form.size,
        species: form.species,
        type: 'lost',
        zoneName,
      });
      if (!response.ok) {
        setResult({ success: false, message: response.error });
        return;
      }
      setResult({ success: true, message: '¡Publicación exitosa! Tu búsqueda ya aparece en tu actividad.' });
      setForm({
        name: '', species: '', breed: '', size: '', gender: '',
        characteristics: '', hiddenClue: '', radius: 2,
      });
      setZoneName('Buenos Aires, Argentina');
      setLocation({ x: 52, y: 52 });
      setPhoto(null);
      router.refresh();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border text-sm shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-red-100";
  const inputStyle = { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' };
  const selectClass = `${inputClass} cursor-pointer`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-7">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-700 mb-3 text-white" style={{ backgroundColor: '#EF4444' }}>
          🔍 MASCOTA PERDIDA
        </div>
        <h1 className="text-3xl md:text-4xl font-700 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>¿Perdiste una mascota?</h1>
        <p className="text-sm mt-2 max-w-xl" style={{ color: 'var(--color-muted-foreground)' }}>
          Completá el formulario para que la comunidad te ayude a encontrarla.
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

      <div className="rounded-[28px] border p-5 md:p-6 flex flex-col gap-6 shadow-sm" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        {/* Section: Animal data */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-4" style={{ color: 'var(--color-muted-foreground)' }}>Datos del animal</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-600 mb-1.5">Nombre de la mascota</label>
              <p className="mb-2 text-[11px] leading-5" style={{ color: 'var(--color-muted-foreground)' }}>Es el nombre que responde la mascota.</p>
              <input autoComplete="off" value={form.name} onChange={e => setForm((prev) => ({ ...prev, name: e.target.value }))} className={inputClass} style={inputStyle} placeholder="Luna" />
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Especie *</label>
              <p className="mb-2 text-[11px] leading-5" style={{ color: 'var(--color-muted-foreground)' }}>Elegí la especie principal.</p>
              <select value={form.species} onChange={e => setForm((prev) => ({ ...prev, species: e.target.value }))} className={selectClass} style={inputStyle}>
                <option value="">Seleccioná</option>
                {species.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Raza</label>
              <p className="mb-2 text-[11px] leading-5" style={{ color: 'var(--color-muted-foreground)' }}>Si no sabes, podés dejarlo vacío.</p>
              <input autoComplete="off" value={form.breed} onChange={e => setForm((prev) => ({ ...prev, breed: e.target.value }))} className={inputClass} style={inputStyle} placeholder="Labrador Retriever" />
            </div>
            <div>
              <label className="block text-sm font-600 mb-1.5">Tamaño *</label>
              <p className="mb-2 text-[11px] leading-5" style={{ color: 'var(--color-muted-foreground)' }}>Ayuda a filtrar la búsqueda.</p>
              <select value={form.size} onChange={e => setForm((prev) => ({ ...prev, size: e.target.value }))} className={selectClass} style={inputStyle}>
                <option value="">Seleccioná</option>
                {sizes.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-600 mb-1.5">Género</label>
              <p className="mb-2 text-[11px] leading-5" style={{ color: 'var(--color-muted-foreground)' }}>Si no lo sabés, podés dejarlo sin completar.</p>
              <select value={form.gender} onChange={e => setForm((prev) => ({ ...prev, gender: e.target.value }))} className={selectClass} style={inputStyle}>
                <option value="">Seleccioná</option>
                {genders.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-600 mb-1.5">Características físicas adicionales</label>
            <p className="mb-2 text-[11px] leading-5" style={{ color: 'var(--color-muted-foreground)' }}>Collar, manchas, tamaño, comportamiento, chip, etc.</p>
            <textarea
              value={form.characteristics}
              onChange={e => setForm((prev) => ({ ...prev, characteristics: e.target.value }))}
              rows={3}
              className={inputClass}
              style={inputStyle}
              placeholder="Color de pelaje, tamaño, marcas, collar, chip..."
            />
          </div>
        </div>

        {/* Section: Photo */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Fotografía</p>
          <label
            className="flex flex-col items-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer hover:border-red-400 transition-all"
            style={{ borderColor: photo ? '#EF4444' : 'var(--color-border)', backgroundColor: photo ? '#FEF2F2' : 'transparent' }}
          >
            <input type="file" accept="image/jpeg,image/jpg,image/png" className="hidden" onChange={e => e.target.files?.[0] && setPhoto(e.target.files[0])} />
            <div className="text-3xl">{photo ? '✅' : '📷'}</div>
            <div className="text-sm font-600">{photo ? photo.name : 'Adjuntar foto de la mascota (JPG)'}</div>
            <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Una foto clara ayuda mucho al reconocimiento</div>
          </label>
        </div>

        {/* Section: Geolocation */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Zona de búsqueda</p>
          <label className="block text-sm font-600 mb-1.5">Ubicación aproximada</label>
          <input
            value={zoneName}
            onChange={e => setZoneName(e.target.value)}
            className={inputClass}
            style={inputStyle}
            placeholder="Palermo, CABA"
            autoComplete="off"
          />
          {mapError && (
            <p className="mt-2 text-xs text-amber-700">{mapError}</p>
          )}

          <div className="relative mt-3 overflow-hidden rounded-xl border" style={{ height: '220px', borderColor: 'var(--color-border)' }}>
            <div ref={mapContainerRef} className="h-full w-full" />
            {!isMapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-sm font-600 text-slate-600">
                Cargando mapa…
              </div>
            )}
          </div>
          <div className="mt-3">
            <label className="block text-sm font-600 mb-1.5">Radio de búsqueda: <span style={{ color: 'var(--color-primary)' }}>{form.radius} km</span></label>
            <input type="range" min={1} max={20} value={form.radius} onChange={e => setForm({ ...form, radius: +e.target.value })} className="w-full accent-orange-500" />
            <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
              <span>1 km</span><span>20 km</span>
            </div>
          </div>
        </div>

        {/* Section: Hidden clue */}
        <div>
          <p className="text-xs font-700 uppercase tracking-wider mb-3" style={{ color: 'var(--color-muted-foreground)' }}>Seguridad</p>
          <div className="p-4 rounded-xl border" style={{ borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
            <label className="block text-sm font-600 mb-1.5">🔒 Dato oculto de verificación</label>
            <input
              value={form.hiddenClue}
              onChange={e => setForm((prev) => ({ ...prev, hiddenClue: e.target.value }))}
              className={inputClass}
              style={inputStyle}
              placeholder="Ej: tiene una mancha en forma de estrella en el lomo"
              autoComplete="off"
            />
            <p className="text-xs mt-2" style={{ color: '#92400E' }}>
              Este dato NO se publica. Solo sirve para verificar que quien reclame a la mascota realmente la conoce.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={publish}
          disabled={isPending}
          className="w-full py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#EF4444' }}
        >
          {isPending ? 'Publicando…' : '🔍 Publicar búsqueda'}
        </button>
      </div>
    </div>
  );
}
