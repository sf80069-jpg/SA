const team = [
  { name: 'Jonatan Figueroa', role: 'Fundador & CEO', avatar: '👨‍💼' },
  { name: 'Priscila Rojas', role: 'Tech Lead', avatar: '👩‍💻' },
  { name: 'Santiago Higa', role: 'Comunidad', avatar: '🧑‍🤝‍🧑' },
];

export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="text-6xl mb-4">🐾</div>
        <h1 className="text-4xl font-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>
          Sobre Search Animal
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-muted-foreground)' }}>
          Somos la plataforma argentina de reunificación de mascotas más avanzada. Combinamos tecnología de matching biométrico con el poder de la comunidad.
        </p>
      </div>

      {/* Mission */}
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        {[
          { icon: '🎯', title: 'Misión', text: 'Reducir el tiempo de separación entre mascotas y sus familias a través de tecnología e inteligencia colectiva.' },
          { icon: '💡', title: 'Visión', text: 'Que ninguna mascota quede sin identificar. Ser el sistema nacional de referencia para hogares, refugios y veterinarias.' },
          { icon: '💛', title: 'Valores', text: 'Transparencia, comunidad, privacidad, y amor por los animales. Cada línea de código tiene un propósito.' },
        ].map(card => (
          <div key={card.title} className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className="text-lg font-700 mb-2">{card.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-muted-foreground)' }}>{card.text}</p>
          </div>
        ))}
      </div>

      {/* History */}
      <div className="p-8 rounded-2xl mb-12" style={{ backgroundColor: 'var(--color-secondary)' }}>
        <h2 className="text-2xl font-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Nuestra historia</h2>
        <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'var(--color-secondary-foreground)' }}>
          <p>
            Search Animal nació en 2023 cuando Valentina perdió a su perra Canela en el barrio de Villa Urquiza. La experiencia de buscarla durante 12 días sin herramientas adecuadas la motivó a crear algo mejor.
          </p>
          <p>
            Junto a un equipo de desarrolladores y amantes de los animales, lanzamos la versión beta con 50 refugios asociados. Hoy contamos con más de 12.500 usuarios registrados y una tasa de reencuentro del 68%.
          </p>
          <p>
            En 2025 incorporamos el sistema de validación biométrica KYC y el motor de matching con inteligencia artificial, reduciendo el tiempo promedio de reencuentro de 18 días a 4,2 días.
          </p>
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-700 mb-6" style={{ fontFamily: 'var(--font-display)' }}>El equipo</h2>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {team.map(member => (
            <div key={member.name} className="p-5 rounded-2xl border text-center" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
              <div className="text-4xl mb-3">{member.avatar}</div>
              <div className="font-700">{member.name}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{member.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="p-6 rounded-2xl border" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
        <h2 className="text-xl font-700 mb-4" style={{ fontFamily: 'var(--font-display)' }}>Contacto</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {[
            { icon: '📧', label: 'Email', value: 'hola@searchanimal.com.ar' },
            { icon: '📍', label: 'Oficina', value: 'Av. Córdoba 1254, CABA' },
            { icon: '📱', label: 'Instagram', value: '@searchanimal' },
          ].map(c => (
            <div key={c.label} className="flex items-center gap-3">
              <span className="text-xl">{c.icon}</span>
              <div>
                <div className="text-xs font-600 uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>{c.label}</div>
                <div className="font-600">{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
