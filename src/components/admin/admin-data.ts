export type Metric = {
  label: string;
  value: string;
  trend: string;
  tone: 'rose' | 'amber' | 'emerald' | 'sky';
};

export type AlertItem = {
  id: string;
  title: string;
  detail: string;
  severity: 'Alta' | 'Media' | 'Baja';
  time: string;
};

export type ActivityItem = {
  id: string;
  actor: string;
  action: string;
  time: string;
  status: 'ok' | 'warn' | 'info';
};

export type Report = {
  id: string;
  petitioner: string;
  type: 'Mascota perdida' | 'Mascota encontrada' | 'Spam' | 'Contenido peligroso';
  zone: string;
  hiddenData: string;
  exactCoords: string;
  risk: 'Alta' | 'Media' | 'Baja';
  status: 'Pendiente' | 'Revisado' | 'Bloqueado';
};

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  region: string;
  score: number;
  penalties: number;
  lastActive: string;
  status: 'Activo' | 'Advertido' | 'Suspendido';
};

export type Petition = {
  id: string;
  name: string;
  specialty: string;
  region: string;
  message: string;
  availability: string;
  status: 'Pendiente' | 'Aprobado' | 'Rechazado';
};

export const metrics: Metric[] = [
  { label: 'Reportes activos', value: '184', trend: '+12% vs ayer', tone: 'rose' },
  { label: 'Coincidencias resueltas', value: '62', trend: '+8% esta semana', tone: 'emerald' },
  { label: 'Alertas urgentes', value: '9', trend: '3 nuevas', tone: 'amber' },
  { label: 'Voluntarios verificados', value: '326', trend: '+19 esta semana', tone: 'sky' },
];

export const alerts: AlertItem[] = [
  { id: 'A-201', title: 'Reporte de animal con riesgo de fuga', detail: 'Se registró en Palermo y requiere revisión manual.', severity: 'Alta', time: 'Hace 4 min' },
  { id: 'A-202', title: 'Cuenta sospechosa', detail: 'Perfil duplicado con 3 reportes en 2 horas.', severity: 'Media', time: 'Hace 18 min' },
  { id: 'A-203', title: 'Solicitud de contacto no verificada', detail: 'Contacto pendiente de validación en San Telmo.', severity: 'Baja', time: 'Hace 1 hora' },
];

export const activity: ActivityItem[] = [
  { id: 'ACT-1', actor: 'Ana G.', action: 'Aprobó 2 reportes en Villa Crespo', time: 'Ahora', status: 'ok' },
  { id: 'ACT-2', actor: 'Marta D.', action: 'Actualizó una alerta de geolocalización', time: 'Hace 12 min', status: 'warn' },
  { id: 'ACT-3', actor: 'Sistema', action: 'Se detectaron 4 coincidencias automáticas', time: 'Hace 28 min', status: 'info' },
  { id: 'ACT-4', actor: 'Luis N.', action: 'Rechazó un reporte duplicado', time: 'Hace 1 hora', status: 'ok' },
];

export const reports: Report[] = [
  { id: 'REP-1042', petitioner: 'María V.', type: 'Mascota perdida', zone: 'Palermo', hiddenData: 'Tiene collar rojo con placa “Luna”', exactCoords: '-34.5902, -58.4317', risk: 'Alta', status: 'Pendiente' },
  { id: 'REP-1048', petitioner: 'Julián P.', type: 'Mascota encontrada', zone: 'Caballito', hiddenData: 'Responde al nombre “Coco” y tiene una pata blanca', exactCoords: '-34.6194, -58.4386', risk: 'Media', status: 'Revisado' },
  { id: 'REP-1057', petitioner: 'Lucía S.', type: 'Spam', zone: 'Online', hiddenData: 'Número de contacto duplicado y 2 publicaciones sospechosas', exactCoords: '-34.6037, -58.3816', risk: 'Alta', status: 'Bloqueado' },
  { id: 'REP-1060', petitioner: 'Diego M.', type: 'Contenido peligroso', zone: 'Recoleta', hiddenData: 'Solicita ubicación exacta para encuentros no verificados', exactCoords: '-34.5883, -58.3936', risk: 'Media', status: 'Pendiente' },
];

export const users: UserRecord[] = [
  { id: 'USR-1', name: 'María Varela', email: 'maria.varela@mail.com', region: 'Palermo', score: 98, penalties: 0, lastActive: 'Hace 3 min', status: 'Activo' },
  { id: 'USR-2', name: 'Julián Pérez', email: 'julianp@gmail.com', region: 'Caballito', score: 74, penalties: 1, lastActive: 'Hace 18 min', status: 'Advertido' },
  { id: 'USR-3', name: 'Lucía Sosa', email: 'lucia.sosa@hotmail.com', region: 'Villa Urquiza', score: 61, penalties: 3, lastActive: 'Hace 2 horas', status: 'Suspendido' },
  { id: 'USR-4', name: 'Diego Marín', email: 'diego.marin@outlook.com', region: 'Recoleta', score: 89, penalties: 0, lastActive: 'Hoy', status: 'Activo' },
];

export const petitions: Petition[] = [
  { id: 'VOL-201', name: 'Paula R.', specialty: 'Recolección', region: 'San Telmo', message: 'Puedo apoyar en búsquedas de barrio y seguimiento de reportes.', availability: 'Fin de semana', status: 'Pendiente' },
  { id: 'VOL-205', name: 'Tomás C.', specialty: 'Medio ambiente', region: 'Villa Crespo', message: 'Trabajo con cámaras y apoyo en rescates de fauna.', availability: 'Mañanas', status: 'Aprobado' },
  { id: 'VOL-211', name: 'Nadia L.', specialty: 'Transporte', region: 'Belgrano', message: 'Tengo auto y puedo trasladar animales en casos puntuales.', availability: 'Tardes', status: 'Pendiente' },
  { id: 'VOL-218', name: 'Gonzalo E.', specialty: 'Voluntariado general', region: 'Flores', message: 'Quiero colaborar con logística y atención a familias.', availability: 'Lunes a viernes', status: 'Rechazado' },
];
