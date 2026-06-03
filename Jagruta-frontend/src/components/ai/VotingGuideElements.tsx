import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { User, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface CandidateRankCardProps {
  rank: number;
  candidate: any;
  matchScore: number;
  reasoning: string;
}

export const CandidateRankCard = ({ rank, candidate, matchScore, reasoning }: CandidateRankCardProps) => {
  return (
    <Card className="overflow-hidden border-border-default bg-bg-surface hover:border-accent-green/50 transition-all group">
      <div className="flex">
        {/* Rank Sidebar */}
        <div className="w-16 bg-bg-elevated flex flex-col items-center justify-center border-r border-border-default group-hover:bg-accent-green/10 transition-colors">
          <span className="font-mono text-3xl font-bold text-text-muted group-hover:text-accent-green">{rank}</span>
          <span className="text-[8px] font-bold uppercase tracking-widest text-text-muted">Rank</span>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-bg-elevated border border-border-default overflow-hidden">
                {candidate.imageUrl ? (
                  <img src={candidate.imageUrl} alt={candidate.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-text-muted">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">{candidate.name}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge party={candidate.party} variant="party">{candidate.party}</Badge>
                  <Badge level={candidate.level} variant="level">{candidate.level}</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Priority Match</span>
              <div className="flex items-center gap-3">
                <div className="h-2 w-32 rounded-full bg-bg-inset overflow-hidden border border-border-subtle">
                  <div className="h-full bg-accent-green" style={{ width: `${matchScore}%` }} />
                </div>
                <span className="font-mono text-sm font-bold text-accent-green">{matchScore}%</span>
              </div>
            </div>
          </div>

          <div className="bg-bg-inset rounded-xl p-4 border border-border-subtle relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-green/30" />
            <div className="flex items-start gap-3">
              <Sparkles size={16} className="text-accent-green shrink-0 mt-1" />
              <p className="text-sm text-text-secondary leading-relaxed italic">
                "{reasoning}"
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" size="sm" asChild className="text-accent-green hover:bg-accent-green/10">
              <Link to={`/politician/${candidate.id}`}>
                Full Track Record <ArrowRight size={14} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
