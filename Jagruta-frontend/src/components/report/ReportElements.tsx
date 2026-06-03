import * as React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface NeighborData {
  id: string;
  name: string;
  grade: string;
  score: number;
}

export const CompareNeighbors = ({ currentId, neighbors }: { currentId: string; neighbors: NeighborData[] }) => {
  return (
    <Card className="overflow-hidden bg-bg-surface border-border-default">
      <div className="bg-bg-elevated/50 px-6 py-3 border-b border-border-default">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Neighbouring Constituencies</h3>
      </div>
      
      <div className="divide-y divide-border-subtle">
        {neighbors.map((n) => (
          <div 
            key={n.id} 
            className={cn(
              "px-6 py-4 flex items-center justify-between transition-colors",
              n.id === currentId ? "bg-accent-green-subtle/10" : "hover:bg-bg-elevated/30"
            )}
          >
            <div className="flex flex-col">
              <span className="font-bold text-sm">{n.name}</span>
              <span className="text-[10px] font-mono text-text-muted uppercase">Assembly</span>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Score</span>
                  <span className="font-mono text-sm">{n.score}</span>
               </div>
               <div className={cn(
                 "h-10 w-10 rounded-lg border flex items-center justify-center font-bold text-lg",
                 n.grade === 'A' || n.grade === 'B' ? "text-status-good border-status-good/30 bg-status-good/5" : "text-accent-gold border-accent-gold/30 bg-accent-gold/5"
               )}>
                 {n.grade}
               </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
