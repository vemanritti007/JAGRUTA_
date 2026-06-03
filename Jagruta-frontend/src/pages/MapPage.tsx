import * as React from 'react';
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// @ts-ignore
import MapboxWorker from 'mapbox-gl/dist/mapbox-gl-csp-worker?worker';

if (typeof window !== 'undefined') {
  (mapboxgl as any).workerClass = MapboxWorker;
}

import { useAppStore } from '../store/app.store';
import { LayerToggle } from '../components/map/LayerToggle';
import { PoliticianMarker, PoliticianBottomSheet } from '../components/map/MapElements';
import { trpc } from '../lib/trpc';
import { mockPoliticians } from '../lib/mocks';
import { Card } from '../components/ui/Card';
import { AlertTriangle, Clock } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const USAGE_LIMIT = 1000; // Define your safe development limit here (Mapbox free tier is 50k)

export default function MapPage() {
  const { 
    mapLayer, 
    pincode, 
    mapboxUsageCount, 
    incrementMapboxUsage, 
    resetMapboxUsageIfNewMonth 
  } = useAppStore();
  
  const [selectedPolitician, setSelectedPolitician] = React.useState<any | null>(null);
  const mapRef = React.useRef<any>(null);

  React.useEffect(() => {
    resetMapboxUsageIfNewMonth();
    if (mapboxUsageCount < USAGE_LIMIT) {
      incrementMapboxUsage();
    }
  }, []);

  const { data: apiPoliticians, isLoading } = trpc['politician.getByLayer'].useQuery(
    { layer: mapLayer },
    { retry: false }
  );

  const politicians = React.useMemo(() => {
    if (apiPoliticians && apiPoliticians.length > 0) return apiPoliticians;
    const coords = [
      { lat: 12.9716, lng: 77.5946 },
      { lat: 12.9352, lng: 77.6245 },
      { lat: 12.9912, lng: 77.5946 },
      { lat: 12.9141, lng: 77.5891 },
      { lat: 12.9592, lng: 77.6974 },
    ];
    return mockPoliticians.slice(0, 5).map((p, i) => ({
      ...p,
      lat: coords[i].lat,
      lng: coords[i].lng,
      photo: p.imageUrl,
      constituencyName: p.constituency
    }));
  }, [apiPoliticians]);

  const [viewState, setViewState] = React.useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 11,
  });

  if (mapboxUsageCount >= USAGE_LIMIT) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-bg-base p-8">
        <Card className="max-w-md border-status-warn/50 bg-status-warn/5 p-8 text-center space-y-6">
          <div className="mx-auto h-16 w-16 rounded-full bg-status-warn/20 text-status-warn flex items-center justify-center">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Mapbox Safety Limit Reached</h2>
            <p className="text-text-secondary">
              To prevent unexpected costs, we've paused map loads. You've reached your local development limit of <strong>{USAGE_LIMIT}</strong> loads this month.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted">
            <Clock size={14} />
            Next Reset: Next Month
          </div>
        </Card>
      </div>
    );
  }

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center bg-bg-base p-8">
        <Card className="max-w-sm space-y-4 p-8 text-center border-dashed border-2">
          <h2 className="text-xl font-bold">Mapbox Token Missing</h2>
          <p className="text-sm text-text-secondary">Add <code>VITE_MAPBOX_TOKEN</code> to your <code>.env</code> file.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-60px-2rem)] w-full overflow-hidden rounded-3xl border border-glass-border shadow-2xl bg-bg-inset">
      <Map
        {...viewState}
        ref={mapRef}
        onMove={(evt) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        onClick={() => setSelectedPolitician(null)}
      >
        <NavigationControl position="top-left" />
        <FullscreenControl position="top-left" />

        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 md:left-4 md:translate-x-0">
          <LayerToggle />
        </div>

        {politicians?.map((p: any) => (
          <Marker key={p.id} latitude={p.lat} longitude={p.lng} anchor="bottom">
            <PoliticianMarker
              politician={p}
              onClick={() => {
                setSelectedPolitician(p);
                mapRef.current?.flyTo({ center: [p.lng, p.lat], zoom: 14, duration: 800 });
              }}
            />
          </Marker>
        ))}
      </Map>

      <PoliticianBottomSheet 
        politician={selectedPolitician} 
        onClose={() => setSelectedPolitician(null)} 
      />
    </div>
  );
}
