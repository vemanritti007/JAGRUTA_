import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { AlertTriangle, Clock, MapPin } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const USAGE_LIMIT = 1000;

export default function MapPage() {
  const [searchParams] = useSearchParams();

  const targetConstituencyId = searchParams.get('constituencyId');
  const targetPoliticianId = searchParams.get('politicianId');

  const {
    mapLayer,
    mapboxUsageCount,
    incrementMapboxUsage,
    resetMapboxUsageIfNewMonth,
  } = useAppStore();

  const [selectedPolitician, setSelectedPolitician] = React.useState<any | null>(null);
  const [viewState, setViewState] = React.useState({
    latitude: 12.9716,
    longitude: 77.5946,
    zoom: 11,
  });

  const mapRef = React.useRef<any>(null);
  const handledUrlSelectionRef = React.useRef<string>('');

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
    if (apiPoliticians && apiPoliticians.length > 0) {
      return apiPoliticians.map((p: any) => ({
        ...p,
        lat: Number(p.lat || 12.9716),
        lng: Number(p.lng || 77.5946),
      }));
    }

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
      constituencyName: p.constituency,
      constituencyId: (p as any).constituencyId || p.id,
    }));
  }, [apiPoliticians]);

  React.useEffect(() => {
    const urlSelectionKey = targetConstituencyId || targetPoliticianId || '';

    if (!urlSelectionKey) {
      return;
    }

    if (handledUrlSelectionRef.current === urlSelectionKey) {
      return;
    }

    if (!politicians || politicians.length === 0) {
      return;
    }

    const matchedPolitician = politicians.find((p: any) => {
      if (targetPoliticianId && p.id === targetPoliticianId) {
        return true;
      }

      if (targetConstituencyId && p.constituencyId === targetConstituencyId) {
        return true;
      }

      return false;
    });

    if (!matchedPolitician) {
      return;
    }

    handledUrlSelectionRef.current = urlSelectionKey;
    setSelectedPolitician(matchedPolitician);

    const lat = Number(matchedPolitician.lat || 12.9716);
    const lng = Number(matchedPolitician.lng || 77.5946);

    setViewState({
      latitude: lat,
      longitude: lng,
      zoom: 14,
    });

    setTimeout(() => {
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 900,
      });
    }, 300);
  }, [politicians, targetConstituencyId, targetPoliticianId]);

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
              To prevent unexpected costs, map loads are paused. You reached your local development limit of{' '}
              <strong>{USAGE_LIMIT}</strong> loads this month.
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

          <p className="text-sm text-text-secondary">
            Add <code>VITE_MAPBOX_TOKEN</code> to your <code>.env</code> file.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-60px-2rem)] w-full overflow-hidden rounded-3xl border border-glass-border shadow-2xl bg-bg-inset">
      {(targetConstituencyId || targetPoliticianId) && selectedPolitician && (
        <div className="absolute top-4 right-4 z-20 rounded-2xl bg-bg-void/90 border border-green-core/30 px-4 py-3 backdrop-blur-xl shadow-xl max-w-xs">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-xl bg-green-core/10 text-green-core flex items-center justify-center">
              <MapPin size={16} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-core">
                Selected Constituency
              </p>

              <p className="text-sm font-bold text-text-primary">
                {selectedPolitician.constituencyName || 'Constituency'}
              </p>

              <p className="text-xs text-text-muted">
                {selectedPolitician.name} · {selectedPolitician.party}
              </p>
            </div>
          </div>
        </div>
      )}

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
          <Marker key={p.id} latitude={Number(p.lat)} longitude={Number(p.lng)} anchor="bottom">
            <PoliticianMarker
              politician={p}
              onClick={() => {
                setSelectedPolitician(p);

                mapRef.current?.flyTo({
                  center: [Number(p.lng), Number(p.lat)],
                  zoom: 14,
                  duration: 800,
                });
              }}
            />
          </Marker>
        ))}
      </Map>

      {isLoading && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-full bg-bg-void/90 border border-glass-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-muted">
          Loading representatives...
        </div>
      )}

      <PoliticianBottomSheet
        politician={selectedPolitician}
        onClose={() => setSelectedPolitician(null)}
      />
    </div>
  );
}