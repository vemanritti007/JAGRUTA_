import * as React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileText, Info, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CriminalSectionProps {
  records: any[];
}

export const CriminalSection = ({ records }: CriminalSectionProps) => {
  const hasCases = records.length > 0;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            hasCases ? "bg-status-bad/10 text-status-bad" : "bg-status-good/10 text-status-good"
          )}>
            <AlertTriangle size={20} />
          </div>
          <h3 className="text-xl font-display font-bold text-text-primary uppercase tracking-tight">
            Criminal Record
          </h3>
        </div>
        <Badge variant="status" status={hasCases ? "broken" : "fulfilled"}>
          {hasCases ? `${records.length} PENDING CASES` : "CLEAN RECORD"}
        </Badge>
      </div>

      {!hasCases ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-status-good/10 flex items-center justify-center text-status-good animate-pulse">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-status-good uppercase tracking-widest text-xs">Verified Clean</p>
            <p className="text-sm text-text-secondary max-w-xs mx-auto">
              No criminal cases found in the latest ADR and self-declared affidavits.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-glass-border">
          <table className="w-full text-left text-sm font-body">
            <thead className="bg-glass-1 text-text-muted uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-4 py-3">Case Type</th>
                <th className="px-4 py-3">Court</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {records.map((r, i) => (
                <tr key={i} className="hover:bg-glass-1 transition-colors">
                  <td className="px-4 py-3 text-text-primary font-medium">{r.type}</td>
                  <td className="px-4 py-3 text-text-secondary">{r.court}</td>
                  <td className="px-4 py-3">
                    <Badge variant="status" status="broken">{r.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

interface AISummaryBlockProps {
  politicianId: string;
}

export const AISummaryBlock = ({ politicianId }: AISummaryBlockProps) => {
  const [summary, setSummary] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fetchSummary = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSummary('');

      const response = await fetch('/api/ai/politician-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ politicianId }),
      });

      if (!response.ok) {
        throw new Error(`AI summary failed with status ${response.status}`);
      }

      const text = await response.text();
      setSummary(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load AI summary');
    } finally {
      setIsLoading(false);
    }
  }, [politicianId]);

  React.useEffect(() => {
    if (politicianId) {
      fetchSummary();
    }
  }, [politicianId, fetchSummary]);

  return (
    <Card variant="green" className="p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles size={64} className="text-green-core" />
      </div>

      <div className="relative space-y-4">
        <div className="flex items-center gap-2 text-green-core">
          <Sparkles size={16} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
            AI Performance Summary
          </span>
        </div>

        <div className="text-text-primary font-body text-lg leading-relaxed min-h-[100px]">
          {isLoading && (
            <div className="space-y-2">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-5/6" />
            </div>
          )}

          {!isLoading && error && (
            <p className="text-sm text-status-bad">
              {error}
            </p>
          )}

          {!isLoading && !error && summary && (
            <p>{summary}</p>
          )}

          {!isLoading && !error && !summary && (
            <p className="text-sm text-text-muted">
              No AI summary available.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-glass-border-green/20">
          <div className="flex items-center gap-2 text-[10px] text-green-core/60 font-mono italic">
            Powered by AI Summary Engine
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchSummary}
            disabled={isLoading}
            className="h-7 text-[10px] border border-glass-border-green/30 text-green-core"
          >
            {isLoading ? 'Generating...' : 'Regenerate Summary'}
          </Button>
        </div>
      </div>
    </Card>
  );
};