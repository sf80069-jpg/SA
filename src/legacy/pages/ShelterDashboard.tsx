import { useEffect, useMemo, useState } from 'react';

const starterAnimals: Animal[] = [
  { id: 1, name: 'Toro', species: 'Perro', since: '12 sep', status: 'Albergado' },
  { id: 2, name: 'Miel', species: 'Gata', since: '5 ago', status: 'En tratamiento' },
  { id: 3, name: 'Manchas', species: 'Perro', since: '1 sep', status: 'Albergado' },
  { id: 4, name: 'Perla', species: 'Gata', since: '18 sep', status: 'Albergado' },
];

const starterMessages = [
  { from: 'Carlos V.', text: '¿Sigue disponible Toro?', time: '10:30' },
  { from: 'Ana R.', text: 'Quiero adoptar a Miel', time: '09:15' },
];

const volunteerCommentsStorageKey = 'search-animal-volunteer-comments';

const starterVolunteers: Volunteer[] = [
  { id: 1, name: 'Paula R.', specialty: 'Traslado', availability: 'Fines de semana' },
  { id: 2, name: 'Tomás C.', specialty: 'Búsqueda', availability: 'Mañanas' },
];

type Animal = {
  id: number;
  name: string;
  species: string;
  since: string;
  status: 'Albergado' | 'En tratamiento' | 'Necesita hogar';
};

type SearchRecord = {
  id: number;
  type: 'Perdido' | 'Encontrado';
  name: string;
  species: string;
  zone: string;
  date: string;
};

type Volunteer = {
  id: number;
  name: string;
  specialty: string;
  availability: string;
};

export default function ShelterDashboard() {
  const [activeTab, setActiveTab] = useState<'animals' | 'search' | 'volunteers' | 'stats'>('animals');
  const [filter, setFilter] = useState('Todos');
  const filters = ['Todos', 'Búsquedas activas', 'Albergados', 'Resueltos'];
  const [animals, setAnimals] = useState<Animal[]>(starterAnimals);
  const [messages, setMessages] = useState(starterMessages);
  const [searchRecords, setSearchRecords] = useState<SearchRecord[]>([
    { id: 1, type: 'Perdido', name: 'Luna', species: 'Perro', zone: 'Palermo', date: 'hoy' },
    { id: 2, type: 'Encontrado', name: 'Coco', species: 'Gato', zone: 'Villa Crespo', date: 'ayer' },
    { id: 3, type: 'Perdido', name: 'Nina', species: 'Gata', zone: 'Caballito', date: '2 días' },
  ]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(starterVolunteers);
  const [animalForm, setAnimalForm] = useState({ name: '', species: 'Perro', status: 'Albergado' as Animal['status'] });
  const [searchForm, setSearchForm] = useState({ type: 'Perdido' as SearchRecord['type'], name: '', species: 'Perro', zone: '' });
  const [volunteerForm, setVolunteerForm] = useState({ name: '', specialty: 'Traslado', availability: 'Fines de semana' });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = window.localStorage.getItem(volunteerCommentsStorageKey);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Array<{ shelter: string; author: string; text: string; time: string }>;
      const newMessages = parsed.map((comment) => ({
        from: comment.author,
        text: `Comentario para ${comment.shelter}: ${comment.text}`,
        time: comment.time,
      }));

      if (newMessages.length > 0) {
        setMessages((current) => [...newMessages, ...current].slice(0, 8));
      }
    } catch {
      window.localStorage.removeItem(volunteerCommentsStorageKey);
    }
  }, []);

  const stats = useMemo(() => {
    const activeLost = searchRecords.filter((item) => item.type === 'Perdido').length;
    const activeFound = searchRecords.filter((item) => item.type === 'Encontrado').length;
    const admitted = animals.filter((item) => item.status === 'Albergado').length;
    const inTreatment = animals.filter((item) => item.status === 'En tratamiento').length;
    const needsHome = animals.filter((item) => item.status === 'Necesita hogar').length;

    return {
      lost: 12 + activeLost,
      found: 9 + activeFound,
      admitted: 22 + admitted,
      volunteers: 16 + volunteers.length,
      inTreatment: 7 + inTreatment,
      adoption: 5 + needsHome,
    };
  }, [animals, searchRecords, volunteers]);

  const handleAddAnimal = () => {
    if (!animalForm.name.trim()) return;
    setAnimals((current) => [
      {
        id: Date.now(),
        name: animalForm.name.trim(),
        species: animalForm.species,
        since: 'hoy',
        status: animalForm.status,
      },
      ...current,
    ]);
    setAnimalForm({ name: '', species: 'Perro', status: 'Albergado' });
    setActiveTab('animals');
  };

  const handleAddSearch = () => {
    if (!searchForm.name.trim() || !searchForm.zone.trim()) return;
    setSearchRecords((current) => [
      {
        id: Date.now(),
        type: searchForm.type,
        name: searchForm.name.trim(),
        species: searchForm.species,
        zone: searchForm.zone.trim(),
        date: 'ahora',
      },
      ...current,
    ]);
    setSearchForm({ type: 'Perdido', name: '', species: 'Perro', zone: '' });
    setActiveTab('search');
  };

  const handleAddVolunteer = () => {
    if (!volunteerForm.name.trim()) return;
    setVolunteers((current) => [
      {
        id: Date.now(),
        name: volunteerForm.name.trim(),
        specialty: volunteerForm.specialty,
        availability: volunteerForm.availability,
      },
      ...current,
    ]);
    setVolunteerForm({ name: '', specialty: 'Traslado', availability: 'Fines de semana' });
    setActiveTab('volunteers');
  };

  const quickActions = [
    { icon: '⚡', label: 'Ingreso múltiple de animales', key: 'animals', desc: 'Carga rápida' },
    { icon: '🔍', label: 'Publicar búsqueda', key: 'search', desc: 'Perdido / encontrado' },
    { icon: '👥', label: 'Solicitar voluntarios', key: 'volunteers', desc: 'Pedir apoyo' },
    { icon: '📊', label: 'Ver estadísticas', key: 'stats', desc: 'Métricas en vivo' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: 'var(--color-muted)' }}>
          🏠
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Refugio Luna</h1>
            <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-700 text-white">🏅 Verificado</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>Panel de control institucional</p>
        </div>
      </div>

      <div className="mb-8 grid gap-3 md:grid-cols-4">
        {quickActions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => setActiveTab(action.key)}
            className="rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5"
            style={{
              backgroundColor: activeTab === action.key ? 'rgba(249, 115, 22, 0.08)' : 'var(--color-card)',
              borderColor: activeTab === action.key ? 'rgba(249, 115, 22, 0.45)' : 'var(--color-border)',
            }}
          >
            <div className="mb-2 text-2xl">{action.icon}</div>
            <div className="text-sm font-700 leading-tight">{action.label}</div>
            <div className="mt-1 text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{action.desc}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-5">
          {activeTab === 'animals' && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <h2 className="mb-4 text-lg font-700" style={{ fontFamily: 'var(--font-display)' }}>Ingreso múltiple de animales</h2>
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  value={animalForm.name}
                  onChange={(event) => setAnimalForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Nombre"
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                />
                <select
                  value={animalForm.species}
                  onChange={(event) => setAnimalForm((current) => ({ ...current, species: event.target.value }))}
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                >
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
                <select
                  value={animalForm.status}
                  onChange={(event) => setAnimalForm((current) => ({ ...current, status: event.target.value as Animal['status'] }))}
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                >
                  <option>Albergado</option>
                  <option>En tratamiento</option>
                  <option>Necesita hogar</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddAnimal}
                className="mt-4 rounded-xl px-4 py-2.5 text-sm font-700 text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Agregar animal
              </button>

              <div className="mt-6 overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
                <table className="w-full text-sm">
                  <thead style={{ backgroundColor: 'var(--color-muted)' }}>
                    <tr>
                      <th className="px-4 py-3 text-left">Nombre</th>
                      <th className="px-4 py-3 text-left">Especie</th>
                      <th className="px-4 py-3 text-left">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {animals.map((animal) => (
                      <tr key={animal.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                        <td className="px-4 py-3 font-600">{animal.name}</td>
                        <td className="px-4 py-3">{animal.species}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full px-2 py-1 text-[11px] font-600" style={{ backgroundColor: animal.status === 'Albergado' ? '#DCFCE7' : animal.status === 'En tratamiento' ? '#FEF3C7' : '#FDE68A', color: '#111827' }}>
                            {animal.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <h2 className="mb-4 text-lg font-700" style={{ fontFamily: 'var(--font-display)' }}>Publicar búsqueda</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <select
                  value={searchForm.type}
                  onChange={(event) => setSearchForm((current) => ({ ...current, type: event.target.value as SearchRecord['type'] }))}
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                >
                  <option>Perdido</option>
                  <option>Encontrado</option>
                </select>
                <select
                  value={searchForm.species}
                  onChange={(event) => setSearchForm((current) => ({ ...current, species: event.target.value }))}
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                >
                  <option>Perro</option>
                  <option>Gato</option>
                  <option>Otro</option>
                </select>
                <input
                  value={searchForm.name}
                  onChange={(event) => setSearchForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Nombre de la mascota"
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none md:col-span-2"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                />
                <input
                  value={searchForm.zone}
                  onChange={(event) => setSearchForm((current) => ({ ...current, zone: event.target.value }))}
                  placeholder="Zona o barrio"
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none md:col-span-2"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddSearch}
                className="mt-4 rounded-xl px-4 py-2.5 text-sm font-700 text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Publicar incidente
              </button>

              <div className="mt-6 space-y-3">
                {searchRecords.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full px-2 py-0.5 text-[10px] font-700 text-white" style={{ backgroundColor: item.type === 'Perdido' ? '#EF4444' : '#10B981' }}>
                          {item.type}
                        </span>
                        <span className="font-600">{item.name}</span>
                      </div>
                      <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{item.species} · {item.zone}</div>
                    </div>
                    <div className="text-right text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{item.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'volunteers' && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <h2 className="mb-4 text-lg font-700" style={{ fontFamily: 'var(--font-display)' }}>Solicitar voluntarios</h2>
              <div className="grid gap-3 md:grid-cols-3">
                <input
                  value={volunteerForm.name}
                  onChange={(event) => setVolunteerForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Nombre"
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                />
                <select
                  value={volunteerForm.specialty}
                  onChange={(event) => setVolunteerForm((current) => ({ ...current, specialty: event.target.value }))}
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                >
                  <option>Traslado</option>
                  <option>Búsqueda</option>
                  <option>Social media</option>
                  <option>Veterinaria</option>
                </select>
                <select
                  value={volunteerForm.availability}
                  onChange={(event) => setVolunteerForm((current) => ({ ...current, availability: event.target.value }))}
                  className="rounded-xl border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}
                >
                  <option>Fines de semana</option>
                  <option>Mañanas</option>
                  <option>Tardes</option>
                  <option>Todos los días</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddVolunteer}
                className="mt-4 rounded-xl px-4 py-2.5 text-sm font-700 text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Pedir apoyo
              </button>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {volunteers.map((volunteer) => (
                  <div key={volunteer.id} className="rounded-xl border p-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                    <div className="font-700">{volunteer.name}</div>
                    <div className="mt-1 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{volunteer.specialty}</div>
                    <div className="mt-2 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Disponibilidad: {volunteer.availability}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <h2 className="mb-4 text-lg font-700" style={{ fontFamily: 'var(--font-display)' }}>Ver estadísticas</h2>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-muted-foreground)' }}>Perdidos</div>
                  <div className="mt-2 text-3xl font-800" style={{ color: '#EF4444' }}>{stats.lost}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>+12% vs. semana pasada</div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-muted-foreground)' }}>Encontrados</div>
                  <div className="mt-2 text-3xl font-800" style={{ color: '#10B981' }}>{stats.found}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>+8% en barrio norte</div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-muted-foreground)' }}>Admitidos</div>
                  <div className="mt-2 text-3xl font-800" style={{ color: '#3B82F6' }}>{stats.admitted}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>+4 albergados este mes</div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-muted-foreground)' }}>En tratamiento</div>
                  <div className="mt-2 text-3xl font-800" style={{ color: '#F59E0B' }}>{stats.inTreatment}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>3 pendientes de revisión</div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-muted-foreground)' }}>Voluntarios</div>
                  <div className="mt-2 text-3xl font-800" style={{ color: '#8B5CF6' }}>{stats.volunteers}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>+2 esta semana</div>
                </div>
                <div className="rounded-xl border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-muted-foreground)' }}>Adopciones</div>
                  <div className="mt-2 text-3xl font-800" style={{ color: '#10B981' }}>{stats.adoption}</div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>+5% respecto al mes anterior</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-700" style={{ fontFamily: 'var(--font-display)' }}>Inventario</h2>
              <div className="flex gap-1">
                {filters.map((filterOption) => (
                  <button
                    key={filterOption}
                    type="button"
                    onClick={() => setFilter(filterOption)}
                    className="rounded-lg px-2.5 py-1 text-[11px] font-600"
                    style={{
                      backgroundColor: filter === filterOption ? 'var(--color-primary)' : 'var(--color-muted)',
                      color: filter === filterOption ? '#ffffff' : 'var(--color-muted-foreground)',
                    }}
                  >
                    {filterOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {animals.map((animal) => (
                <div key={animal.id} className="flex items-center justify-between rounded-xl border p-3" style={{ borderColor: 'var(--color-border)' }}>
                  <div>
                    <div className="font-600">{animal.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{animal.species}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{animal.since}</div>
                    <span className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-700" style={{ backgroundColor: animal.status === 'Albergado' ? '#DCFCE7' : animal.status === 'En tratamiento' ? '#FEF3C7' : '#FDE68A', color: '#111827' }}>
                      {animal.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <h2 className="mb-3 text-lg font-700" style={{ fontFamily: 'var(--font-display)' }}>📬 Mensajes</h2>
            <div className="space-y-2">
              {messages.map((message, index) => (
                <div key={`${message.from}-${message.time}-${index}`} className="rounded-xl border p-3" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                  <div className="flex items-center justify-between">
                    <div className="font-600 text-sm">{message.from}</div>
                    <div className="text-[11px]" style={{ color: 'var(--color-muted-foreground)' }}>{message.time}</div>
                  </div>
                  <div className="mt-1 text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{message.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
