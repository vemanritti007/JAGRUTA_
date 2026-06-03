import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PartyScore, ManifestoPromise } from '../../types/manifesto';
import { cn } from '../../lib/utils';
import { ExternalLink, CheckCircle2, Clock, AlertCircle, CircleDashed } from 'lucide-react';

export const FulfillmentMeter = ({ counts }: { counts: PartyScore['counts'] }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const getW = (v: number) => `${(v / total) * 100}%`;

  return (
    <div className="space-y-2">
       <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-bg-inset">
        <div style={{ width: getW(counts.fulfilled) }} className="bg-status-good" />
        <div style={{ width: getW(counts.inProgress) }} className="bg-status-warn" />
        <div style={{ width: getW(counts.broken) }} className="bg-status-bad" />
        <div style={{ width: getW(counts.notStarted) }} className="bg-text-muted" />
      </div>
      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-text-muted">
        <span>{Math.round((counts.fulfilled / total) * 100)}% Fulfilled</span>
        <span>{total} Total Promises</span>
      </div>
    </div>
  );
};

export const PromiseCard = ({ promise }: { promise: ManifestoPromise }) => {
  const icons = {
    fulfilled: <CheckCircle2 size={16} className="text-status-good" />,
    'in-progress': <Clock size={16} className="text-status-warn" />,
    broken: <AlertCircle size={16} className="text-status-bad" />,
    'not-started': <CircleDashed size={16} className="text-text-muted" />,
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="p-5 flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Badge party={promise.party as any} variant="party">{promise.party}</Badge>
          <div className="flex items-center gap-1.5 rounded-full bg-bg-inset px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted border border-border-subtle">
             {icons[promise.status]}
             {promise.status.replace('-', ' ')}
          </div>
        </div>
        
        <p className="text-sm font-medium leading-relaxed text-text-primary">
          {promise.text}
        </p>
      </div>
      
      <div className="bg-bg-elevated/30 border-t border-border-subtle px-5 py-3 flex items-center justify-between">
        <Badge className="bg-bg-inset text-[9px] border-border-subtle">{promise.category}</Badge>
        {promise.evidence_url && (
          <a href={promise.evidence_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] font-bold uppercase text-accent-green hover:underline">
            Evidence <ExternalLink size={12} />
          </a>
        )}
      </div>
    </Card>
  );
};
