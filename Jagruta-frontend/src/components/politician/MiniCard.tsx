import * as React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ScoreRing } from '../ui/ScoreRing';
import { Politician } from '../../types/politician';
import { User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, getPartyColor } from '../../lib/utils';

interface PoliticianMiniCardProps {
  politician: Politician;
}

export const PoliticianMiniCard = ({ politician }: PoliticianMiniCardProps) => {
  const partyColor = getPartyColor(politician.party);

  return (
    <Card variant="interactive" className="politician-card group">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          {/* Photo with party ring */}
          <div className="politician-photo-ring" style={{ '--party-colour': partyColor } as any}>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 16px ${partyColor}4d` }} />
            {politician.imageUrl ? (
              <img src={politician.imageUrl} alt={politician.name} className="politician-photo" />
            ) : (
              <div className="politician-photo flex items-center justify-center bg-bg-depth text-text-muted">
                <User size={24} />
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-bold text-lg text-text-primary leading-tight group-hover:text-green-core transition-colors">
              {politician.name}
            </h3>
            <p className="font-body text-xs text-text-muted leading-tight uppercase tracking-wider">
              {politician.constituency}
            </p>
            <div className="flex gap-2 mt-2">
              <Badge variant="level" level={politician.level as any}>
                {politician.level}
              </Badge>
              <Badge variant="party" party={politician.party as any}>
                {politician.party}
              </Badge>
            </div>
          </div>
        </div>

        <ScoreRing score={politician.score} size="md" />
      </div>

      <div className="mt-auto pt-4 border-t border-glass-border flex items-center justify-between">
        <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          {(politician as any).yearsInOffice} Years in Office
        </div>
        <Link
          to={`/politician/${politician.id}`}
          className="flex items-center gap-1.5 text-xs font-bold text-text-secondary group-hover:text-green-core transition-all"
        >
          View Profile <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};

interface ConstituencyResultsRowProps {
  politicians: Politician[];
  loading?: boolean;
}

export const ConstituencyResultsRow = ({ politicians, loading }: ConstituencyResultsRowProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[220px] rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      {politicians.map((politician, index) => (
        <motion.div
          key={politician.id}
          variants={{
            hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0)' },
          }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <PoliticianMiniCard politician={politician} />
        </motion.div>
      ))}
    </motion.div>
  );
};
