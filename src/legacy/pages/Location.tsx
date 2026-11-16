import { useEffect, useRef, useState } from 'react';
import { getMapPublicationsAction } from '@/app/(frontend)/actions';
import { percentToMapCoordinates } from '@/lib/map-coordinates';
import type { LayerGroup, Map as LeafletMap } from 'leaflet';

type MapPublication = {
  id: string;
  type: 'lost' | 'found';
  name: string;
  species: string;
  breed?: string;
  size?: string;
  gender?: string;
  zoneName: string;
  locationX: number;
  locationY: number;
  photo?: string;
  createdAt: string;
};

export default function Location() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [publications, setPublications] = useState<MapPublication[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);

  useEffect(() => {
    getMapPublicationsAction().then((result) => {
      if (result.ok) {
        setPublications(result.data as MapPublication[]);
      }
    });
  }, []);

  useEffect(() => {
    let disposed = false;
    let map: LeafletMap | null = null;

    const initializeMap = async () => {
      const L = await import('leaflet');
      const container = mapContainerRef.current;
      if (disposed || !container) return;

      map = L.map(container).setView([-34.6037, -58.3816], 11);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
      mapRef.current = map;
      markersLayerRef.current = L.layerGroup().addTo(map);
      setMapReady(true);
      setMapError(null);
    };

    void initializeMap().catch(() => {
      if (!disposed) setMapError('No se pudo cargar OpenStreetMap. Revisá tu conexión e intentá nuevamente.');
    });

    return () => {
      disposed = true;
      map?.remove();
      mapRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersLayerRef.current;
    if (!mapReady || !map || !layer) return;

    let cancelled = false;
    const renderMarkers = async () => {
      const L = await import('leaflet');
      if (cancelled) return;

      const visible = publications.filter((publication) => filter === 'all' || publication.type === filter);
      layer.clearLayers();
      const points: [number, number][] = [];

      visible.forEach((publication) => {
        const { lat, lng } = percentToMapCoordinates(publication.locationX, publication.locationY);
        const point: [number, number] = [lat, lng];
        points.push(point);
        const color = publication.type === 'lost' ? '#EF4444' : '#10B981';
        const marker = L.circleMarker(point, {
          radius: 10,
          color: '#ffffff',
          weight: 2,
          fillColor: color,
          fillOpacity: 1,
        }).addTo(layer);

        const popup = document.createElement('div');
        popup.style.minWidth = '180px';
        const name = document.createElement('strong');
        name.textContent = publication.name;
        const details = document.createElement('div');
        details.textContent = `${publication.type === 'lost' ? 'Mascota perdida' : 'Mascota encontrada'} · ${publication.species} · ${publication.breed || 'Sin raza'}`;
        const zone = document.createElement('div');
        zone.textContent = `Zona: ${publication.zoneName}`;
        popup.append(name, details, zone);
        marker.bindPopup(popup);
        marker.on('click', () => {
          setSelected(publication.id);
          map.panTo(point);
        });

        if (selected === publication.id) marker.openPopup();
      });

      if (selected) {
        const selectedPublication = visible.find((publication) => publication.id === selected);
        if (selectedPublication) {
          const point = percentToMapCoordinates(selectedPublication.locationX, selectedPublication.locationY);
          map.setView([point.lat, point.lng], Math.max(map.getZoom(), 13));
        }
      } else if (points.length > 0) {
        map.fitBounds(L.latLngBounds(points), { padding: [24, 24], maxZoom: 13 });
      }
    };

    void renderMarkers();
    return () => {
      cancelled = true;
    };
  }, [filter, mapReady, publications, selected]);

  const filtered = publications.filter((publication) => filter === 'all' || publication.type === filter);
  const selectedPublication = filtered.find((publication) => publication.id === selected) ?? filtered[0] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-700" style={{ fontFamily: 'var(--font-display)' }}>Mapa de actividad</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-muted-foreground)' }}>
          Visualizá mascotas perdidas y encontradas cerca tuyo en tiempo real con publicaciones reales de la comunidad.
        </p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'Todos', color: '#6B7280' },
          { key: 'lost', label: '🔍 Perdidos', color: '#EF4444' },
          { key: 'found', label: '🐾 Encontrados', color: '#10B981' },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as typeof filter)}
            className="px-3 py-1.5 rounded-full text-sm font-600 transition-all"
            style={{
              backgroundColor: filter === filterOption.key ? filterOption.color : 'var(--color-muted)',
              color: filter === filterOption.key ? 'white' : 'var(--color-muted-foreground)',
            }}
          >
            {filterOption.label}
          </button>
        ))}
      </div>

      {mapError && (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {mapError}
        </div>
      )}

      <div className="relative rounded-2xl border overflow-hidden" style={{ height: '420px', borderColor: 'var(--color-border)', backgroundColor: '#E8F4E8' }}>
        {!mapReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#E8F4E8] text-sm font-600 text-slate-600">
            Cargando mapa…
          </div>
        )}

        <div ref={mapContainerRef} className="h-full w-full" />

        {mapReady && (
          <div className="absolute top-3 right-3 bg-white/90 rounded-lg px-3 py-1.5 text-xs font-600" style={{ color: 'var(--color-muted-foreground)' }}>
            📍 Buenos Aires, Argentina
          </div>
        )}

        {!mapReady && filtered.length > 0 && (
          <>
            {filtered.map((publication) => {
              const x = publication.locationX ?? 50;
              const y = publication.locationY ?? 50;

              return (
                <button
                  key={publication.id}
                  onClick={() => setSelected((current) => (current === publication.id ? null : publication.id))}
                  className="absolute transition-all hover:scale-125"
                  style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
                >
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-sm"
                    style={{
                      backgroundColor: publication.type === 'lost' ? '#EF4444' : '#10B981',
                    }}
                  >
                    {publication.type === 'lost' ? '🔍' : '🐾'}
                  </div>
                  {selected === publication.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-white rounded-xl shadow-xl p-3 w-40 text-left">
                      <div className="text-xs font-700">{publication.name}</div>
                      <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{publication.species}</div>
                      <div className="text-xs mt-1" style={{ color: publication.type === 'lost' ? '#EF4444' : '#10B981' }}>
                        {publication.type === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>

      {selectedPublication && (
        <div className="mt-4 rounded-2xl border p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs font-700 uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                {selectedPublication.type === 'lost' ? 'Animal perdido' : 'Animal encontrado'}
              </div>
              <h2 className="text-2xl font-700 mt-1">{selectedPublication.name}</h2>
            </div>
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-700 text-white"
              style={{ backgroundColor: selectedPublication.type === 'lost' ? '#EF4444' : '#10B981' }}
            >
              {selectedPublication.type === 'lost' ? 'Perdido' : 'Encontrado'}
            </span>
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Especie</div>
              <div className="font-700 mt-1">{selectedPublication.species}</div>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Raza</div>
              <div className="font-700 mt-1">{selectedPublication.breed || 'No especificada'}</div>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-muted)' }}>
              <div className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Zona</div>
              <div className="font-700 mt-1">{selectedPublication.zoneName}</div>
            </div>
          </div>

          <p className="mt-3 text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
            {selectedPublication.type === 'lost'
              ? 'Se reportó como mascota perdida en esta zona. La comunidad puede ayudar a ubicarlo y contactar a quien lo publicó.'
              : 'Se reportó como mascota encontrada en esta zona. Puede estar esperando ser identificada o devuelta a su familia.'}
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Perdidos', count: filtered.filter((item) => item.type === 'lost').length, color: '#EF4444' },
          { label: 'Encontrados', count: filtered.filter((item) => item.type === 'found').length, color: '#10B981' },
          { label: 'Total', count: filtered.length, color: '#8B5CF6' },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border text-center" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="text-2xl font-700" style={{ color: item.color }}>{item.count}</div>
            <div className="text-xs mt-1" style={{ color: 'var(--color-muted-foreground)' }}>{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
