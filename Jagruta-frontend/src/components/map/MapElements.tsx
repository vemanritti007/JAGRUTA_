import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, ArrowRight } from 'lucide-react';
import { ScoreRing } from '../ui/ScoreRing';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { cn, getPartyColor } from '../../lib/utils';
import { useAppStore } from '../../store/app.store';

interface PoliticianMarkerProps {
  politician: any;
  onClick: () => void;
}

export const PoliticianMarker = ({ politician, onClick }: PoliticianMarkerProps) => {
  const partyColor = getPartyColor(politician.party);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="group relative flex flex-col items-center"
    >
      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-bg-void shadow-card group-hover:scale-110 transition-transform">
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: partyColor, boxShadow: `0 0 10px ${partyColor}` }}
        />

        {politician.photo ? (
          <img src={politician.photo} alt={politician.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-bg-depth text-text-muted">
            <User size={20} />
          </div>
        )}
      </div>

      <div className="mt-2 px-2 py-0.5 rounded bg-glass-elevated border border-glass-border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
        <span className="text-[10px] font-bold text-text-primary uppercase tracking-wider">
          {politician.name}
        </span>
      </div>
    </button>
  );
};

interface PoliticianBottomSheetProps {
  politician: any | null;
  onClose: () => void;
}

export const PoliticianBottomSheet = ({ politician, onClose }: PoliticianBottomSheetProps) => {
  const navigate = useNavigate();
  const { comparePoliticians, setComparePoliticians } = useAppStore();

  if (!politician) return null;

  const partyColor = getPartyColor(politician.party);

  const handleAddToCompare = () => {
    const first = comparePoliticians[0];
    const second = comparePoliticians[1];

    if (!first || first === politician.id) {
      setComparePoliticians([politician.id, second || '']);
      navigate(`/compare?a=${politician.id}`);
      return;
    }

    if (!second || second === politician.id) {
      setComparePoliticians([first, politician.id]);
      navigate(`/compare?a=${first}&b=${politician.id}`);
      return;
    }

    setComparePoliticians([first, politician.id]);
    navigate(`/compare?a=${first}&b=${politician.id}`);
  };

  const compareButtonText = comparePoliticians[0] && comparePoliticians[0] !== politician.id
    ? 'Add as Candidate B'
    : 'Add to Compare';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bottom-sheet"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-glass-1 hover:bg-glass-2 transition-colors text-text-muted hover:text-text-primary"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex gap-4 items-start">
            <div className="politician-photo-ring" style={{ '--party-colour': partyColor } as any}>
              {politician.photo ? (
                <img src={politician.photo} alt={politician.name} className="politician-photo" />
              ) : (
                <div className="politician-photo flex items-center justify-center bg-bg-depth text-text-muted">
                  <User size={32} />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-bold text-text-primary tracking-tight">
                {politician.name}
              </h2>

              <div className="flex flex-wrap gap-2">
                <Badge variant="party" party={politician.party as any}>
                  {politician.party}
                </Badge>
                <Badge variant="level" level={politician.level as any}>
                  {politician.level}
                </Badge>
              </div>

              <p className="text-sm font-body text-text-secondary uppercase tracking-widest">
                {politician.constituencyName}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-around bg-glass-1 rounded-xl p-4 border border-glass-border">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                Performance
              </span>
              <ScoreRing score={politician.score} size="md" />
            </div>

            <div className="h-8 w-px bg-glass-border" />

            <div className="text-center space-y-1">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                Criminal Cases
              </span>
              <div
                className={cn(
                  'font-mono text-xl font-bold',
                  politician.criminal?.caseCount > 0 ? 'text-status-bad' : 'text-status-good'
                )}
              >
                {politician.criminal?.caseCount || 0}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <Button asChild className="w-full md:w-auto h-12">
              <Link to={`/politician/${politician.id}`} className="flex items-center gap-2">
                View Full Profile <ArrowRight size={16} />
              </Link>
            </Button>

            <Button variant="secondary" className="w-full md:w-auto" onClick={handleAddToCompare}>
              {compareButtonText}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};