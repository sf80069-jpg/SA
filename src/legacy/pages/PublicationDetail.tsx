import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { getPublicationByIdAction } from '@/app/(frontend)/actions';

type PublicationDetailData = {
  breed: string;
  characteristics: string;
  contact: string;
  createdAt: string;
  description: string;
  gender: string;
  id: string;
  img: string;
  name: string;
  photo?: string;
  size: string;
  species: string;
  type: 'lost' | 'found';
  zoneName: string;
};

export default function PublicationDetail() {
  const { id } = useParams();
  const [publication, setPublication] = useState<PublicationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [contactVisible, setContactVisible] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setPublication(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getPublicationByIdAction(id).then((result) => {
      if (result.ok) {
        setPublication(result.data as PublicationDetailData);
      } else {
        setPublication(null);
      }
      setLoading(false);
    });
  }, [id]);

  if (!id || (!loading && !publication)) {
    return <Navigate to="/inicio" replace />;
  }

  if (loading || !publication) {
    return <div className="max-w-5xl mx-auto px-4 py-12 text-sm text-muted-foreground">Cargando publicación…</div>;
  }

  const isLost = publication.type === 'lost';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/inicio" className="inline-flex items-center gap-2 text-sm font-700 mb-5" style={{ color: 'var(--color-primary)' }}>
        ← Volver a publicaciones
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
        <section className="rounded-3xl overflow-hidden border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
          <div className="relative overflow-hidden rounded-t-3xl bg-black/5">
            <button
              type="button"
              onClick={() => (publication.photo || publication.img ? setViewerOpen(true) : undefined)}
              className={`block w-full border-0 bg-transparent p-0 text-left ${publication.photo || publication.img ? 'cursor-zoom-in' : 'cursor-default'}`}
              aria-label={publication.photo || publication.img ? 'Abrir vista de imagen' : 'Sin imagen disponible'}
            >
              <div className="w-full overflow-hidden" style={{ maxHeight: '36rem' }}>
                {publication.photo || publication.img ? (
                  <img
                    src={publication.photo || publication.img}
                    alt={publication.name}
                    className="w-full object-cover transition-transform duration-300 ease-out"
                    style={{
                      minHeight: '32rem',
                      maxHeight: '36rem',
                      filter: 'saturate(1.05)',
                    }}
                  />
                ) : (
                  <div className="flex w-full items-center justify-center text-center" style={{ minHeight: '32rem', maxHeight: '36rem', background: 'linear-gradient(135deg, #f8d7a2 0%, #f97316 100%)' }}>
                    <div className="text-white">
                      <div className="text-5xl mb-2">🐾</div>
                      <div className="text-lg font-800">Sin foto disponible</div>
                    </div>
                  </div>
                )}
              </div>
            </button>
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-800 text-white"
              style={{ backgroundColor: isLost ? 'var(--color-destructive)' : 'var(--color-accent)' }}
            >
              {isLost ? 'PERDIDO' : 'ENCONTRADO'}
            </span>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <h1 className="text-3xl font-700">{publication.name}</h1>
                <p className="mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  {publication.species} · {publication.breed}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-700" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-secondary-foreground)' }}>
                Publicado el {new Date(publication.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>

            <p className="leading-relaxed">{publication.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {[
                ['Especie', publication.species],
                ['Raza', publication.breed],
                ['Tamaño', publication.size],
                ['Género', publication.gender],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl p-3" style={{ backgroundColor: 'var(--color-muted)' }}>
                  <div className="text-xs mb-1" style={{ color: 'var(--color-muted-foreground)' }}>{label}</div>
                  <div className="font-700">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl border p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
            <p className="text-xs font-700 uppercase tracking-wide mb-2" style={{ color: 'var(--color-muted-foreground)' }}>Última ubicación reportada</p>
            <div className="rounded-2xl h-40 flex items-center justify-center text-center p-4" style={{ backgroundColor: 'var(--color-muted)' }}>
              <div>
                <div className="text-4xl mb-2">📍</div>
                <div className="font-700">{publication.zoneName}</div>
                <div className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>Ubicación aproximada por seguridad</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border p-5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
            <h2 className="text-xl font-700 mb-1">¿Tenés información?</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-muted-foreground)' }}>
              Contactá a {publication.contact} de forma segura desde la plataforma.
            </p>

            {messageSent ? (
              <div className="rounded-2xl p-4 text-sm font-700" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-secondary-foreground)' }}>
                Mensaje enviado. Te avisaremos cuando {publication.contact} responda.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setContactVisible(value => !value)}
                  className="w-full py-3 rounded-xl font-700 text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {contactVisible ? 'Ocultar contacto' : 'Ver opciones de contacto'}
                </button>
                {contactVisible && (
                  <div className="rounded-2xl p-4 mt-1" style={{ backgroundColor: 'var(--color-muted)' }}>
                    <p className="text-sm font-700 mb-3">Contacto protegido con {publication.contact}</p>
                    <button
                      onClick={() => setMessageSent(true)}
                      className="w-full py-2.5 rounded-xl font-700 text-white"
                      style={{ backgroundColor: 'var(--color-accent)' }}
                    >
                      Enviar mensaje
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      </div>

      {(publication.photo || publication.img) && (
        <ImageViewer
          image={publication.photo || publication.img}
          title={publication.name}
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}

function ImageViewer({
  image,
  title,
  open,
  onClose,
}: {
  image: string;
  title: string;
  open: boolean;
  onClose: () => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!open) {
      setZoomed(false);
      setDragX(0);
      setDragY(0);
    }
  }, [open]);

  if (!open) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.78)' : 'rgba(255,255,255,0.78)' }}
      onClick={onClose}
    >
      <div
        className="relative mx-4 flex h-[90vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.1)',
          backgroundColor: isDark ? '#121212' : '#f8fafc',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border px-3 py-2 backdrop-blur-sm"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)',
            backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
          }}
        >
          <button
            type="button"
            onClick={() => setZoomed((value) => !value)}
            className="rounded-full px-2.5 py-1 text-sm font-700 transition"
            style={{
              color: isDark ? '#fff' : '#111827',
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)',
            }}
          >
            {zoomed ? 'Reducir' : 'Zoom'}
          </button>
          <button
            type="button"
            onClick={() => setTheme((value) => (value === 'dark' ? 'light' : 'dark'))}
            className="rounded-full px-2.5 py-1 text-sm font-700 transition"
            style={{
              color: isDark ? '#fff' : '#111827',
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.05)',
            }}
          >
            {isDark ? 'Claro' : 'Oscuro'}
          </button>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full border px-3 py-2 text-sm font-700 backdrop-blur-sm transition"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.12)',
            backgroundColor: isDark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.7)',
            color: isDark ? '#fff' : '#111827',
          }}
        >
          ✕
        </button>

        <div className="flex h-full w-full items-center justify-center overflow-hidden px-6 py-10">
          <img
            src={image}
            alt={title}
            className="max-h-[80vh] w-auto max-w-full object-contain transition-transform duration-300 ease-out"
            style={{
              transform: zoomed ? `translate(${dragX}px, ${dragY}px) scale(1.6)` : `translate(${dragX}px, ${dragY}px) scale(1)`,
              cursor: zoomed ? 'grab' : 'zoom-in',
              touchAction: 'pan-y',
              boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(15,23,42,0.12)',
            }}
            onTouchStart={(event) => {
              if (!zoomed) return;
              const touch = event.touches[0];
              dragStartRef.current = { x: touch.clientX - dragX, y: touch.clientY - dragY };
            }}
            onTouchMove={(event) => {
              if (!zoomed || !dragStartRef.current) return;
              const touch = event.touches[0];
              setDragX(touch.clientX - dragStartRef.current.x);
              setDragY(touch.clientY - dragStartRef.current.y);
            }}
            onTouchEnd={() => {
              dragStartRef.current = null;
            }}
            onMouseDown={(event) => {
              if (!zoomed) return;
              dragStartRef.current = {
                x: event.clientX - dragX,
                y: event.clientY - dragY,
              };
            }}
            onMouseMove={(event) => {
              if (!zoomed || !dragStartRef.current) return;
              setDragX(event.clientX - dragStartRef.current.x);
              setDragY(event.clientY - dragStartRef.current.y);
            }}
            onMouseUp={() => {
              dragStartRef.current = null;
            }}
            onMouseLeave={() => {
              dragStartRef.current = null;
            }}
          />
        </div>
      </div>
    </div>
  );
}
