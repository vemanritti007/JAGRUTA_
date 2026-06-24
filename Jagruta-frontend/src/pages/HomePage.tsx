import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/app.store';
import { PincodeInput } from '../components/home/PincodeControls';
import { ConstituencyResultsRow } from '../components/politician/MiniCard';
import { trpc } from '../lib/trpc';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { FileText, LocateFixed, Loader2, AlertCircle } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function extractPincodeFromMapbox(data: any) {
  const features = data?.features || [];

  for (const feature of features) {
    const text = String(feature?.text || '');
    const placeName = String(feature?.place_name || '');

    if (/^\d{6}$/.test(text)) {
      return text;
    }

    const match = placeName.match(/\b\d{6}\b/);
    if (match) {
      return match[0];
    }

    const context = feature?.context || [];
    for (const item of context) {
      const contextText = String(item?.text || '');
      if (/^\d{6}$/.test(contextText)) {
        return contextText;
      }
    }
  }

  return '';
}

export default function HomePage() {
  const { t } = useTranslation();
  const { pincode, setPincode, setConstituency } = useAppStore();

  const [inputValue, setInputValue] = React.useState(pincode || '');
  const [submittedPincode, setSubmittedPincode] = React.useState(pincode || '');
  const [hasSubmitted, setHasSubmitted] = React.useState(Boolean(pincode));
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [locationError, setLocationError] = React.useState('');

  const resultsRef = React.useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
  } = trpc['constituency.getByPincode'].useQuery(
    { pincode: submittedPincode },
    {
      enabled: submittedPincode.length === 6,
      retry: false,
    }
  );

  React.useEffect(() => {
    if (data) {
      setConstituency(data as any);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [data, setConstituency]);

  const handleSubmit = (overridePincode?: string) => {
    const nextPincode = String(overridePincode || inputValue).trim();

    if (!/^\d{6}$/.test(nextPincode)) {
      setLocationError('Please enter a valid 6-digit pincode.');
      return;
    }

    setLocationError('');
    setInputValue(nextPincode);
    setSubmittedPincode(nextPincode);
    setPincode(nextPincode);
    setHasSubmitted(true);
  };

  const handleUseMyLocation = async () => {
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Location is not supported in this browser.');
      return;
    }

    if (!MAPBOX_TOKEN) {
      setLocationError('Mapbox token missing. Add VITE_MAPBOX_TOKEN in frontend .env.');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_TOKEN}&types=postcode,address,place,locality,neighborhood&country=IN`;

          const response = await fetch(url);
          const json = await response.json();

          const detectedPincode = extractPincodeFromMapbox(json);

          if (!detectedPincode) {
            setLocationError('Could not detect pincode from your location. Please enter pincode manually.');
            setLocationLoading(false);
            return;
          }

          handleSubmit(detectedPincode);
          setLocationLoading(false);
        } catch {
          setLocationError('Could not detect location. Please enter pincode manually.');
          setLocationLoading(false);
        }
      },
      () => {
        setLocationError('Location permission denied. Please allow location or enter pincode manually.');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const handleClearPincode = () => {
    setHasSubmitted(false);
    setInputValue('');
    setSubmittedPincode('');
    setPincode(null);
    setConstituency(null);
    setLocationError('');
  };

  const reportId = data?.assembly?.id || 'c1';

  return (
    <div className="page-enter flex flex-col items-center">
      <section className="hero-section text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="max-w-4xl space-y-12"
        >
          <div className="space-y-6">
            <h1 className="flex flex-col items-center gap-1">
              <span className="text-[clamp(28px,9vw,96px)] font-display tracking-[0.15em] text-text-primary leading-[0.9] drop-shadow-md whitespace-nowrap">
                {t('app_name')}
              </span>

              <span className="text-[clamp(16px,6vw,42px)] font-sans text-text-secondary tracking-[0.15em] opacity-80 leading-none whitespace-nowrap -mt-1">
                {t('app_subtext')}
              </span>
            </h1>

            <p className="font-mono text-[clamp(10px,2.5vw,16px)] tracking-[0.25em] uppercase text-text-muted mt-6 max-w-[90vw] mx-auto leading-relaxed text-center">
              {t('tagline')}
            </p>
          </div>

          <div className="space-y-6 tour-pincode-input">
            <PincodeInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={() => handleSubmit()}
              loading={isLoading}
              error={error ? 'Something went wrong. Try again.' : null}
            />

            <div className="flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                className="inline-flex items-center gap-2 rounded-full border border-green-core/30 bg-green-core/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-green-core hover:bg-green-core/20 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {locationLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Detecting...
                  </>
                ) : (
                  <>
                    <LocateFixed size={16} />
                    Use My Location
                  </>
                )}
              </button>

              {locationError && (
                <div className="flex items-center gap-2 rounded-2xl border border-status-bad/30 bg-status-bad/10 px-4 py-3 text-xs text-status-bad">
                  <AlertCircle size={14} />
                  {locationError}
                </div>
              )}

              {hasSubmitted && (
                <button
                  type="button"
                  onClick={handleClearPincode}
                  className="text-[10px] font-bold text-text-muted hover:text-green-core uppercase tracking-[0.2em] transition-colors"
                >
                  — {t('change_pincode')} —
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <AnimatePresence>
        {hasSubmitted && (
          <motion.section
            ref={resultsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="results-section py-24"
          >
            <div className="results-header">
              {t('representing_pincode')} {submittedPincode || pincode}
            </div>

            <ConstituencyResultsRow
              politicians={data?.representatives || []}
              loading={isLoading}
            />

            {data?.representatives?.length === 0 && !isLoading && (
              <p className="mt-8 text-center text-sm text-text-muted">
                No representative found for this pincode in the database.
              </p>
            )}

            <div className="mt-16 flex justify-center">
              <Button asChild className="font-medium px-8 gap-2">
                <Link to={`/report/${reportId}`}>
                  <FileText size={16} /> View Constituency Report Card
                </Link>
              </Button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}