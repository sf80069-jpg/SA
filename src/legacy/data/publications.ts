export type Publication = {
  id: string;
  type: 'lost' | 'found';
  name: string;
  species: string;
  breed: string;
  zone: string;
  date: string;
  size: string;
  gender: string;
  description: string;
  contact: string;
  img: string;
};

export const publications: Publication[] = [
  {
    id: 'luna',
    type: 'lost',
    name: 'Luna',
    species: 'Perra',
    breed: 'Labrador',
    zone: 'Palermo, CABA',
    date: '15 sep 2026',
    size: 'Mediana',
    gender: 'Hembra',
    description: 'Es muy cariñosa y responde a su nombre. Llevaba un collar rojo cuando se perdió cerca del parque.',
    contact: 'María',
    img: 'photo-1587300003388-59208cc962cb',
  },
  {
    id: 'copo',
    type: 'found',
    name: 'Copo',
    species: 'Gato',
    breed: 'Mestizo',
    zone: 'Villa Crespo, CABA',
    date: '8 ago 2026',
    size: 'Pequeño',
    gender: 'Macho',
    description: 'Fue encontrado tranquilo y en buen estado. Tiene pelaje blanco y gris y parece estar acostumbrado a vivir en una casa.',
    contact: 'Julián',
    img: 'photo-1514888286974-6c03e2ca1dba',
  },
  {
    id: 'max',
    type: 'lost',
    name: 'Max',
    species: 'Perro',
    breed: 'Golden Retriever',
    zone: 'Belgrano, CABA',
    date: '2 ago 2026',
    size: 'Grande',
    gender: 'Macho',
    description: 'Es amistoso, tiene siete años y una mancha clara en una de sus patas delanteras. Puede acercarse si lo llaman por su nombre.',
    contact: 'Sofía',
    img: 'photo-1552053831-71594a27632d',
  },
];
