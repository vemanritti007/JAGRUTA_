import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PartyScore, ManifestoPromise } from '../../types/manifesto';
import {
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDashed,
  FileText,
} from 'lucide-react';

function normalizeStatus(status: string | undefined) {
  const value = String(status || 'pending').toLowerCase();

  if (value === 'fulfilled') return 'fulfilled';
  if (value === 'in-progress' || value === 'in progress') return 'in-progress';
  if (value === 'broken') return 'broken';

  return 'not-started';
}

function getStatusLabel(status: string | undefined) {
  const value = String(status || 'pending').toLowerCase();

  if (value === 'pending') return 'not started';
  if (value === 'not-started') return 'not started';
  if (value === 'in-progress') return 'in progress';
  if (value === 'in progress') return 'in progress';

  return value.replace('-', ' ');
}

function isValidEvidenceUrl(value: string | undefined) {
  if (!value) return false;

  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/evidence/')
  );
}

export const FulfillmentMeter = ({ counts }: { counts: PartyScore['counts'] }) => {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const getW = (value: number) => {
    if (total === 0) return '0%';
    return `${(value / total) * 100}%`;
  };

  const fulfilledPercent =
    total === 0 ? 0 : Math.round((counts.fulfilled / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-bg-inset">
        <div style={{ width: getW(counts.fulfilled) }} className="bg-status-good" />
        <div style={{ width: getW(counts.inProgress) }} className="bg-status-warn" />
        <div style={{ width: getW(counts.broken) }} className="bg-status-bad" />
        <div style={{ width: getW(counts.notStarted) }} className="bg-text-muted" />
      </div>

      <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-text-muted">
        <span>{fulfilledPercent}% Fulfilled</span>
        <span>{total} Total Promises</span>
      </div>
    </div>
  );
};

export const PromiseCard = ({ promise }: { promise: ManifestoPromise }) => {
  const status = normalizeStatus((promise as any).status);
  const evidenceUrl = (promise as any).evidence_url || '';
  const evidenceText = (promise as any).evidence || 'Manifesto PDF';

  const icons: Record<string, React.ReactNode> = {
    fulfilled: <CheckCircle2 size={16} className="text-status-good" />,
    'in-progress': <Clock size={16} className="text-status-warn" />,
    broken: <AlertCircle size={16} className="text-status-bad" />,
    'not-started': <CircleDashed size={16} className="text-text-muted" />,
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="p-5 flex-1 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Badge party={(promise as any).party} variant="party">
            {(promise as any).party}
          </Badge>

          <div className="flex items-center gap-1.5 rounded-full bg-bg-inset px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-text-muted border border-border-subtle">
            {icons[status]}
            {getStatusLabel((promise as any).status)}
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed text-text-primary">
          {(promise as any).text ||
            (promise as any).description ||
            (promise as any).title}
        </p>
      </div>

      <div className="bg-bg-elevated/30 border-t border-border-subtle px-5 py-3 flex items-center justify-between gap-4">
        <Badge className="bg-bg-inset text-[9px] border-border-subtle">
          {(promise as any).category}
        </Badge>

        {isValidEvidenceUrl(evidenceUrl) ? (
          <a
            href={evidenceUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={evidenceText}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-accent-green hover:underline"
          >
            Evidence <ExternalLink size={12} />
          </a>
        ) : (
          <span
            title={evidenceText}
            className="flex items-center gap-1 text-[10px] font-bold uppercase text-text-muted"
          >
            Evidence <FileText size={12} />
          </span>
        )}
      </div>
    </Card>
  );
};