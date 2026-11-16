import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getMyPublicationsAction, updatePublicationAction } from '@/app/(frontend)/actions';
import { useAuth } from '../auth/AuthContext';

type ActivityPublication = {
  breed?: string;
  characteristics?: string;
  comments?: string;
  createdAt: string;
  gender?: string;
  hiddenClue?: string;
  id: string;
  locationX?: number;
  locationY?: number;
  name: string;
  photo?: string;
  radius?: number;
  size?: string;
  species: string;
  status: 'active' | 'resolved';
  type: 'lost' | 'found';
  zoneName?: string;
};

const feedPosts = [
  { shelter: 'Refugio Amigos del Alma', avatar: '🏠', verified: true, text: '5 cachorritos rescatados esta semana buscan hogar', date: 'hace 2 h', img: 'photo-1596854407944-bf87f6fdd049' },
  { shelter: 'Vet Belgrano Norte', avatar: '⚕️', verified: true, text: 'Jornada de castración gratuita el sábado 26/9', date: 'hace 5 h', img: null },
];

export default function Profile() {
  const [tab, setTab] = useState<'posts' | 'feed'>('posts');
  const [myPosts, setMyPosts] = useState<ActivityPublication[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState({
    breed: '',
    characteristics: '',
    comments: '',
    gender: '',
    hiddenClue: '',
    locationX: 50,
    locationY: 50,
    name: '',
    photo: '',
    radius: 2,
    size: 'Mediano (5–20 kg)',
    species: '',
    type: 'lost' as 'lost' | 'found',
    zoneName: '',
  });
  const [editingError, setEditingError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    getMyPublicationsAction()
      .then(result => {
        if (result.ok) setMyPosts(result.data as ActivityPublication[]);
        else setPostsError(result.error);
      })
      .finally(() => setLoadingPosts(false));
  }, []);

  const resolvedCount = myPosts.filter(post => post.status === 'resolved').length;
  const activeCount = myPosts.filter(post => post.status === 'active').length;

  const openEdit = (post: ActivityPublication) => {
    setEditingId(post.id);
    setEditingForm({
      breed: post.breed || '',
      characteristics: post.characteristics || '',
      comments: post.comments || '',
      gender: post.gender || '',
      hiddenClue: post.hiddenClue || '',
      locationX: post.locationX ?? 50,
      locationY: post.locationY ?? 50,
      name: post.name,
      photo: post.photo || '',
      radius: post.radius ?? 2,
      size: post.size || 'Mediano (5–20 kg)',
      species: post.species,
      type: post.type,
      zoneName: post.zoneName || '',
    });
    setEditingError('');
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setEditingError('');

    const photoData = editingForm.photo.startsWith('data:image/') ? editingForm.photo : undefined;
    const result = await updatePublicationAction(editingId, {
      breed: editingForm.breed,
      characteristics: editingForm.characteristics,
      comments: editingForm.comments,
      gender: editingForm.gender,
      hiddenClue: editingForm.hiddenClue,
      locationX: editingForm.locationX,
      locationY: editingForm.locationY,
      name: editingForm.name,
      photo: photoData,
      radius: editingForm.radius,
      size: editingForm.size,
      species: editingForm.species,
      type: editingForm.type,
      zoneName: editingForm.zoneName || 'Zona sin especificar',
    });

    if (!result.ok) {
      setEditingError(result.error);
      return;
    }

    setEditingId(null);
    const refreshed = await getMyPublicationsAction();
    if (refreshed.ok) setMyPosts(refreshed.data as ActivityPublication[]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Profile header */}
      <div className="rounded-2xl border p-6 flex items-center gap-5 mb-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ backgroundColor: 'var(--color-muted)' }}>
          {user?.avatar ?? '🐶'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-700" style={{ fontFamily: 'var(--font-display)' }}>{user?.username ?? 'Mi perfil'}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-600" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-secondary-foreground)' }}>
              Verificado ✓
            </span>
          </div>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>{user?.email ?? 'Tu actividad en Search Animal'}</p>
          <div className="flex gap-4 mt-3 text-sm">
            <span><strong>{myPosts.length}</strong> publicaciones</span>
            <span><strong>{resolvedCount}</strong> resueltos</span>
            <span><strong>{activeCount}</strong> activos</span>
          </div>
        </div>
        <button className="px-3 py-1.5 rounded-xl border text-sm font-600 self-start" style={{ borderColor: 'var(--color-border)' }}>
          Editar
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-5" style={{ borderColor: 'var(--color-border)' }}>
        {[
          { key: 'posts', label: '📋 Mis publicaciones' },
          { key: 'feed', label: '📰 Comunidad' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className="px-4 py-3 text-sm font-600 border-b-2 -mb-px transition-all"
            style={{
              borderColor: tab === t.key ? 'var(--color-primary)' : 'transparent',
              color: tab === t.key ? 'var(--color-primary)' : 'var(--color-muted-foreground)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="flex flex-col gap-3">
          {loadingPosts && (
            <div className="rounded-2xl border p-6 text-center text-sm" style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}>
              Cargando tu actividad…
            </div>
          )}
          {postsError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-600 text-red-700">
              {postsError}
            </div>
          )}
          {myPosts.map(post => (
            <div key={post.id} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                  {post.photo ? (
                    <img src={post.photo} alt={post.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className={`grid h-full w-full place-items-center text-3xl ${post.type === 'lost' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                      {post.type === 'lost' ? '🔍' : '🐾'}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-700">{post.name}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-600 text-white"
                      style={{ backgroundColor: post.type === 'lost' ? '#EF4444' : '#10B981' }}
                    >
                      {post.type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                    </span>
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                    {post.species} · {new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(post.createdAt))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    className="rounded-lg border px-3 py-1.5 text-xs font-600"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    Editar
                  </button>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-600"
                    style={{
                      backgroundColor: post.status === 'active' ? '#FEF3C7' : '#DCFCE7',
                      color: post.status === 'active' ? '#92400E' : '#14532D',
                    }}
                  >
                    {post.status === 'active' ? 'Activo' : 'Resuelto'}
                  </span>
                </div>
              </div>

              {editingId === post.id && (
                <div className="mt-4 rounded-xl border p-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-muted)' }}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="text-sm font-600">
                      Tipo
                      <select
                        value={editingForm.type}
                        onChange={e => setEditingForm({ ...editingForm, type: e.target.value as 'lost' | 'found' })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                      >
                        <option value="lost">Perdido</option>
                        <option value="found">Encontrado</option>
                      </select>
                    </label>

                    <label className="text-sm font-600">
                      Nombre
                      <input
                        value={editingForm.name}
                        onChange={e => setEditingForm({ ...editingForm, name: e.target.value })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Nombre"
                      />
                    </label>

                    <label className="text-sm font-600">
                      Especie
                      <input
                        value={editingForm.species}
                        onChange={e => setEditingForm({ ...editingForm, species: e.target.value })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Perro, gato..."
                      />
                    </label>

                    <label className="text-sm font-600">
                      Raza
                      <input
                        value={editingForm.breed}
                        onChange={e => setEditingForm({ ...editingForm, breed: e.target.value })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Labrador, mestizo..."
                      />
                    </label>

                    <label className="text-sm font-600">
                      Tamaño
                      <input
                        value={editingForm.size}
                        onChange={e => setEditingForm({ ...editingForm, size: e.target.value })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Pequeño, mediano..."
                      />
                    </label>

                    <label className="text-sm font-600">
                      Género
                      <input
                        value={editingForm.gender}
                        onChange={e => setEditingForm({ ...editingForm, gender: e.target.value })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Macho/Hembra"
                      />
                    </label>

                    <label className="text-sm font-600 md:col-span-2">
                      Zona de búsqueda
                      <input
                        value={editingForm.zoneName}
                        onChange={e => setEditingForm({ ...editingForm, zoneName: e.target.value })}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Palermo, CABA"
                      />
                    </label>

                    <label className="text-sm font-600 md:col-span-2">
                      Ubicación aproximada (X, Y)
                      <div className="mt-1 grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editingForm.locationX}
                          onChange={e => setEditingForm({ ...editingForm, locationX: Number(e.target.value) || 50 })}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                          placeholder="X"
                        />
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={editingForm.locationY}
                          onChange={e => setEditingForm({ ...editingForm, locationY: Number(e.target.value) || 50 })}
                          className="w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                          placeholder="Y"
                        />
                      </div>
                    </label>

                    <label className="text-sm font-600 md:col-span-2">
                      Características físicas
                      <textarea
                        value={editingForm.characteristics}
                        onChange={e => setEditingForm({ ...editingForm, characteristics: e.target.value })}
                        rows={2}
                        className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                        placeholder="Color, marcas, collar, chip..."
                      />
                    </label>

                    {editingForm.type === 'lost' && (
                      <label className="text-sm font-600 md:col-span-2">
                        Pista oculta
                        <input
                          value={editingForm.hiddenClue}
                          onChange={e => setEditingForm({ ...editingForm, hiddenClue: e.target.value })}
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                          placeholder="Último sitio visto o detalle útil"
                        />
                      </label>
                    )}

                    {editingForm.type === 'found' && (
                      <label className="text-sm font-600 md:col-span-2">
                        Comentarios
                        <textarea
                          value={editingForm.comments}
                          onChange={e => setEditingForm({ ...editingForm, comments: e.target.value })}
                          rows={2}
                          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)' }}
                          placeholder="Dónde se encontró, cómo estaba, estado del animal..."
                        />
                      </label>
                    )}

                    <label className="text-sm font-600 md:col-span-2">
                      Radio de búsqueda
                      <input
                        type="range"
                        min={1}
                        max={20}
                        value={editingForm.radius}
                        onChange={e => setEditingForm({ ...editingForm, radius: Number(e.target.value) })}
                        className="mt-2 w-full"
                        style={{ accentColor: '#F97316' }}
                      />
                      <span className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{editingForm.radius} km</span>
                    </label>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-lg border px-3 py-2 text-xs font-600" style={{ borderColor: 'var(--color-border)' }}>
                      Cambiar foto
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setEditingForm({ ...editingForm, photo: String(reader.result ?? '') });
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    {editingForm.photo && (
                      <img src={editingForm.photo} alt="Preview de la publicación" className="h-14 w-14 rounded-lg object-cover" />
                    )}
                  </div>

                  {editingError && <div className="mt-3 text-xs font-600 text-red-700">{editingError}</div>}

                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={saveEdit} className="rounded-lg bg-orange-500 px-3 py-2 text-xs font-700 text-white">
                      Guardar cambios
                    </button>
                    <button type="button" onClick={() => setEditingId(null)} className="rounded-lg border px-3 py-2 text-xs font-600" style={{ borderColor: 'var(--color-border)' }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {!loadingPosts && !postsError && myPosts.length === 0 && (
            <div className="rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--color-border)' }}>
              <div className="mb-2 text-3xl">🐾</div>
              <p className="font-700">Todavía no publicaste ninguna actividad</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                Reportá una mascota perdida o encontrada para verla acá.
              </p>
            </div>
          )}
          <Link
            to="/lost"
            className="w-full py-3 rounded-xl border-2 border-dashed text-sm font-600 text-center transition-all hover:border-orange-400"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted-foreground)' }}
          >
            + Nueva publicación
          </Link>
        </div>
      )}

      {tab === 'feed' && (
        <div className="flex flex-col gap-4">
          {feedPosts.map((post, i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: 'var(--color-muted)' }}>
                  {post.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-600 text-sm">{post.shelter}</span>
                    {post.verified && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-600 text-white" style={{ backgroundColor: '#10B981' }}>
                        ✓ Verificado
                      </span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{post.date}</div>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{post.text}</p>
              {post.img && (
                <Image
                  src={`https://images.unsplash.com/${post.img}?w=600&h=240&fit=crop&auto=format`}
                  alt={post.text}
                  width={600}
                  height={240}
                  className="mt-3 h-40 w-full rounded-xl object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
