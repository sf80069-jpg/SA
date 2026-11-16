import { Link } from 'react-router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getRecentPublicationsAction } from '@/app/(frontend)/actions';
import { useAuth } from '../auth/AuthContext';

const publicQuickActions = [
  { to: '/login', label: 'Iniciar sesión', icon: '🔑', desc: 'Accedé a tu cuenta', color: '#F97316' },
  { to: '/register', label: 'Crear una cuenta', icon: '✨', desc: 'Sumate a la comunidad', color: '#8B5CF6' },
  { to: '/lost', label: 'Perdí una mascota', icon: '🔍', desc: 'Publicar búsqueda', color: '#EF4444' },
  { to: '/found', label: 'Encontré una mascota', icon: '🐾', desc: 'Reportar hallazgo', color: '#10B981' },
  { to: '/about', label: 'Sobre nosotros', icon: 'ℹ️', desc: 'Conocé la plataforma', color: '#8B5CF6' },
  { to: '/support', label: 'Soporte', icon: '💬', desc: 'Ayuda y reclamos', color: '#3B82F6' },
  { to: '/location', label: 'Mapa', icon: '📍', desc: 'Ver zonas activas', color: '#F59E0B' },
];

const memberQuickActions = [
  { to: '/lost', label: 'Perdí una mascota', icon: '🔍', desc: 'Publicar búsqueda', color: '#EF4444' },
  { to: '/found', label: 'Encontré una mascota', icon: '🐾', desc: 'Reportar hallazgo', color: '#10B981' },
  { to: '/location', label: 'Mapa', icon: '📍', desc: 'Ver zonas activas', color: '#F59E0B' },
  { to: '/profile', label: 'Mi Perfil', icon: '👤', desc: 'Panel personal', color: '#EC4899' },
  { to: '/support', label: 'Soporte', icon: '💬', desc: 'Ayuda y reclamos', color: '#3B82F6' },
  { to: '/about', label: 'Sobre nosotros', icon: 'ℹ️', desc: 'Conocé la plataforma', color: '#8B5CF6' },
];

const stats = [
  { label: 'Mascotas reunidas', value: '3.842' },
  { label: 'Usuarios activos', value: '12.500+' },
  { label: 'Refugios asociados', value: '87' },
  { label: 'Tasa de reencuentro', value: '68%' },
];

const volunteerRequests = [
  {
    shelter: 'Refugio Luna',
    location: 'Palermo, CABA',
    specialty: 'Traslado y logística',
    availability: 'Fines de semana',
    need: 'Necesitamos ayuda para llevar mascotas al veterinario y coordinar traslados.',
    urgency: 'Urgente'
  },
  {
    shelter: 'Hogar de Patitas',
    location: 'Villa Crespo, CABA',
    specialty: 'Búsqueda y difusión',
    availability: 'Mañanas',
    need: 'Buscamos voluntarios para difundir casos activos y alimentar la red de contacto.',
    urgency: 'Activa'
  },
  {
    shelter: 'Mundo Animal',
    location: 'Caballito, CABA',
    specialty: 'Cuidado y socialización',
    availability: 'Tardes',
    need: 'Se requiere apoyo para acompañamiento, limpieza y socialización de animales.',
    urgency: 'Alta'
  },
];

const volunteerCommentsStorageKey = 'search-animal-volunteer-comments';

type RecentPost = {
  id: string;
  name: string;
  species: string;
  type: 'lost' | 'found';
  zoneName?: string;
  createdAt: string;
  photo?: string;
};

export default function Home({ authenticated = false }: { authenticated?: boolean }) {
  const { user } = useAuth();
  const isInstitution = user?.role === 'institution';
  const quickActions = authenticated ? memberQuickActions : publicQuickActions;
  const displayName = user?.institutionName || user?.username || 'Usuario';
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [volunteerDrafts, setVolunteerDrafts] = useState<Record<string, string>>({});
  const [volunteerComments, setVolunteerComments] = useState<Record<string, Array<{ author: string; text: string; time: string }>>>({});

  useEffect(() => {
    getRecentPublicationsAction().then((result) => {
      if (result.ok) {
        setRecentPosts(result.data as RecentPost[]);
      }
    });

    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(volunteerCommentsStorageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Array<{ shelter: string; author: string; text: string; time: string }>;
          const grouped: Record<string, Array<{ author: string; text: string; time: string }>> = {};
          parsed.forEach((entry) => {
            if (!grouped[entry.shelter]) grouped[entry.shelter] = [];
            grouped[entry.shelter].push({ author: entry.author, text: entry.text, time: entry.time });
          });
          setVolunteerComments(grouped);
        } catch {
          window.localStorage.removeItem(volunteerCommentsStorageKey);
        }
      }
    }
  }, []);

  const handleVolunteerComment = (shelter: string) => {
    if (!authenticated) return;

    const text = (volunteerDrafts[shelter] || '').trim();
    if (!text) return;

    if (typeof window === 'undefined') return;

    const payload = {
      shelter,
      author: displayName,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const previous = JSON.parse(window.localStorage.getItem(volunteerCommentsStorageKey) || '[]') as Array<typeof payload>;
    const next = [...previous, payload];
    window.localStorage.setItem(volunteerCommentsStorageKey, JSON.stringify(next));

    setVolunteerComments((current) => ({
      ...current,
      [shelter]: [...(current[shelter] || []), { author: payload.author, text: payload.text, time: payload.time }],
    }));

    setVolunteerDrafts((current) => ({ ...current, [shelter]: '' }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          >
            <source src="/video/portada.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/35" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-40 w-50">
              <img
                src="/logo.png"
                alt="Search Animal"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-5xl font-700 leading-tight mb-4" style={{ fontFamily: 'var(--font-display)', color: '#ffffff' }}>
            {authenticated ? (isInstitution ? `Bienvenido, ${displayName}` : `Hola, ${displayName}`) : 'Reunimos mascotas'}<br />
            <span style={{ color: '#f8d7a2' }}>{authenticated ? (isInstitution ? 'Panel del refugio' : '¿Cómo podemos ayudarte hoy?') : 'con sus familias'}</span>
          </h1>
          <p className="text-lg mb-8 text-white/90">
            {authenticated
              ? (isInstitution
                ? 'Tu refugio ya está activo. Revisá solicitudes, compartí animales en tránsito y administrá tus publicaciones desde el panel institucional.'
                : 'Tu cuenta está lista. Reportá una mascota, explorá el mapa o administrá tu perfil desde un solo lugar.')
              : 'La plataforma comunitaria argentina para reportar mascotas perdidas y encontradas. Tecnología de matching biométrico y geolocalización en tiempo real.'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              to="/lost"
              className="px-6 py-3 rounded-xl font-700 text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: '#EF4444' }}
            >
              🔍 Perdí una mascota
            </Link>
            <Link
              to="/found"
              className="px-6 py-3 rounded-xl font-700 text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: '#10B981' }}
            >
              🐾 Encontré una mascota
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y py-8 px-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-800" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
                {s.value}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="py-12 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-700 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          {authenticated ? 'Tu inicio' : 'Acceso rápido'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link
              key={action.to}
              to={action.to}
              className="p-4 rounded-2xl border flex flex-col gap-2 hover:-translate-y-1 transition-all group"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
            >
              <div className="text-3xl">{action.icon}</div>
              <div className="font-700 text-sm" style={{ color: 'var(--color-foreground)' }}>{action.label}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{action.desc}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-12 px-4 max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-2xl font-700" style={{ fontFamily: 'var(--font-display)' }}>
            Solicitudes de voluntariado
          </h2>
          <span className="rounded-full px-3 py-1 text-xs font-700" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
            Refugios activos
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {volunteerRequests.map((request) => (
            <div
              key={request.shelter}
              className="rounded-2xl border p-4 transition-transform hover:-translate-y-1"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="font-700 text-base">{request.shelter}</div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-700 text-white"
                  style={{ backgroundColor: request.urgency === 'Urgente' ? '#EF4444' : request.urgency === 'Activa' ? '#F59E0B' : '#10B981' }}
                >
                  {request.urgency}
                </span>
              </div>

              <div className="space-y-2 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                <div>📍 {request.location}</div>
                <div>🛠️ {request.specialty}</div>
                <div>⏰ {request.availability}</div>
              </div>

              <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--color-foreground)' }}>
                {request.need}
              </p>

              {authenticated ? (
                <div className="mt-4 space-y-3 border-t pt-3" style={{ borderColor: 'var(--color-border)' }}>
                  <textarea
                    value={volunteerDrafts[request.shelter] || ''}
                    onChange={(event) =>
                      setVolunteerDrafts((current) => ({
                        ...current,
                        [request.shelter]: event.target.value,
                      }))
                    }
                    placeholder="Dejá un comentario o valoración para este refugio..."
                    rows={3}
                    className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                  />
                  <button
                    type="button"
                    onClick={() => handleVolunteerComment(request.shelter)}
                    className="w-full rounded-xl px-3 py-2 text-sm font-700 text-white"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Enviar comentario
                  </button>

                  {(volunteerComments[request.shelter] || []).length > 0 && (
                    <div className="space-y-2">
                      {(volunteerComments[request.shelter] || []).slice(-2).map((comment) => (
                        <div key={`${comment.author}-${comment.time}-${comment.text}`} className="rounded-lg border p-2 text-xs" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <span className="font-700">{comment.author}</span>
                            <span style={{ color: 'var(--color-muted-foreground)' }}>{comment.time}</span>
                          </div>
                          <div>{comment.text}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed p-3 text-center text-xs" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}>
                  Vista previa. Iniciá sesión para interactuar y dejar un comentario para este refugio.
                  <div className="mt-2">
                    <Link to="/login" className="inline-block rounded-lg px-3 py-1.5 font-700 text-white" style={{ backgroundColor: 'var(--color-primary)' }}>
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 px-4 max-w-5xl mx-auto">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-700" style={{ fontFamily: 'var(--font-display)' }}>
                {authenticated ? 'Publicaciones de la comunidad' : 'Publicaciones recientes'}
              </h2>
              {authenticated && (
                <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
                  Abrí una publicación para ver más información o contactar a quien la creó.
                </p>
              )}
            </div>
            {!authenticated && (
              <span className="text-xs font-700 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-muted-foreground)' }}>
                Iniciá sesión para interactuar
              </span>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recentPosts.length > 0 ? recentPosts.map(post => (
              <Link
                key={post.id}
                to={authenticated ? `/publication/${post.id}` : '/login'}
                className="block rounded-2xl overflow-hidden border transition-transform hover:-translate-y-1"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
              >
                <div className="relative">
                  {post.photo ? (
                    <img src={post.photo} alt={post.name} className="w-full h-44 object-cover" />
                  ) : (
                    <div className="flex h-44 w-full items-center justify-center text-center" style={{ background: 'linear-gradient(135deg, #f8d7a2 0%, #f97316 100%)' }}>
                      <div className="text-white">
                        <div className="text-3xl">🐾</div>
                        <div className="text-sm font-700">Sin foto</div>
                      </div>
                    </div>
                  )}
                  <span
                    className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-700 text-white"
                    style={{ backgroundColor: post.type === 'lost' ? '#EF4444' : '#10B981' }}
                  >
                    {post.type === 'lost' ? '🔍 PERDIDO' : '🐾 ENCONTRADO'}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-700">{post.name}</div>
                    <span className="text-xs font-700" style={{ color: 'var(--color-primary)' }}>
                      {authenticated ? 'Ver más →' : 'Ingresar →'}
                    </span>
                  </div>
                  <div className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                    {post.species}
                  </div>
                  <div className="text-xs mt-1 flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
                    📍 {post.zoneName || 'Zona no especificada'}
                  </div>
                </div>
              </Link>
            )) : (
              <div className="md:col-span-3 rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
                <div className="font-700">Todavía no hay publicaciones recientes</div>
                <div className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>La comunidad aparecerá acá cuando publiquen mascotas perdidas o encontradas.</div>
              </div>
            )}
          </div>
        </section>
    </div>
  );
}
