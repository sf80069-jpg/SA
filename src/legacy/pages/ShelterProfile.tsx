const animals = [
  { name: 'Toro', species: 'Perro', age: '2 años', status: 'Adoptable', img: 'photo-1558618666-fcd25c85cd64' },
  { name: 'Miel', species: 'Gata', age: '1 año', status: 'Adoptable', img: 'photo-1513245543132-31f507417b26' },
  { name: 'Manchas', species: 'Perro', age: '4 años', status: 'En tratamiento', img: 'photo-1587300003388-59208cc962cb' },
];

export default function ShelterProfile() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="rounded-2xl border p-6 mb-6" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0" style={{ backgroundColor: 'var(--color-muted)' }}>
            🏠
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Refugio Amigos del Alma</h1>
              <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-700 text-white" style={{ backgroundColor: '#10B981' }}>
                🏅 Hogar Verificado
              </span>
            </div>
            <div className="text-sm mt-1 flex items-center gap-1" style={{ color: 'var(--color-muted-foreground)' }}>
              📍 Av. Rivadavia 5500, Boedo, CABA
            </div>
            <div className="flex gap-3 mt-3 flex-wrap">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 text-white transition-all hover:opacity-90" style={{ backgroundColor: 'var(--color-primary)' }}>
                📞 Llamar
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-600 border transition-all hover:bg-gray-50" style={{ borderColor: 'var(--color-border)' }}>
                📧 Mensaje
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-600 border transition-all hover:bg-gray-50" style={{ borderColor: 'var(--color-border)' }}>
                📍 Cómo llegar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Animales albergados', value: '47' },
          { label: 'Adopciones exitosas', value: '312' },
          { label: 'Años en actividad', value: '8' },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="text-2xl font-700" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{s.value}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Animals wall */}
      <h2 className="text-xl font-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Animales albergados</h2>
      <div className="grid grid-cols-3 gap-3">
        {animals.map(animal => (
          <div key={animal.name} className="rounded-2xl overflow-hidden border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <Image
              src={`https://images.unsplash.com/${animal.img}?w=300&h=200&fit=crop&auto=format`}
              alt={animal.name}
              width={300}
              height={200}
              className="w-full h-36 object-cover"
            />
            <div className="p-3">
              <div className="font-700 text-sm">{animal.name}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{animal.species} · {animal.age}</div>
              <span
                className="mt-2 inline-block text-xs px-2 py-0.5 rounded-full font-600"
                style={{
                  backgroundColor: animal.status === 'Adoptable' ? '#DCFCE7' : '#FEF3C7',
                  color: animal.status === 'Adoptable' ? '#14532D' : '#92400E',
                }}
              >
                {animal.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import Image from 'next/image';
