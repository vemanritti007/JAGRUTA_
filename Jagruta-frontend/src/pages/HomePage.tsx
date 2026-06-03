import * as React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/app.store';
import { PincodeInput, LocationButton } from '../components/home/PincodeControls';
import { ConstituencyResultsRow } from '../components/politician/MiniCard';
import { trpc } from '../lib/trpc';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react';

export default function HomePage() {
  const { t } = useTranslation();
  const { pincode, setPincode } = useAppStore();

  const [inputValue, setInputValue] = React.useState(pincode || '');
  const [hasSubmitted, setHasSubmitted] = React.useState(!!pincode);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const { data, isLoading, error, refetch } = trpc['constituency.getByPincode'].useQuery(
    { pincode: inputValue },
    { enabled: false }
  );

  const handleSubmit = async (overridePincode?: string) => {
    const nextPincode = overridePincode || inputValue;

    if (nextPincode.length === 6) {
      setInputValue(nextPincode);
      setPincode(nextPincode);
      setHasSubmitted(true);

      const { data: results } = await refetch();

      if (results) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
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
                JAGRUTA
              </span>
              <span className="text-[clamp(16px,6vw,42px)] font-sans text-text-secondary tracking-[0.15em] opacity-80 leading-none whitespace-nowrap -mt-1">
                ಜಾಗೃತ
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
              <LocationButton onDetect={(p) => handleSubmit(p)} />

              {hasSubmitted && (
                <button
                  onClick={() => {
                    setHasSubmitted(false);
                    setInputValue('');
                    setPincode(null);
                  }}
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
              {t('representing_pincode')} {pincode}
            </div>

            <ConstituencyResultsRow politicians={data?.representatives || []} loading={isLoading} />

            {data?.representatives?.length === 0 && !isLoading && (
              <p className="mt-8 text-center text-sm text-text-muted">
                No representative found for this pincode in the demo database.
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