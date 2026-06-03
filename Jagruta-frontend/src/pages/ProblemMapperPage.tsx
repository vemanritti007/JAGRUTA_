import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PoliticianMiniCard } from '../components/politician/MiniCard';
import { trpc } from '../lib/trpc';
import { MessageSquare, Sparkles, Send, RefreshCw, Info, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EXAMPLE_PROBLEMS = [
  'No streetlights since 6 months',
  'Garbage not collected',
  'Pothole near school entrance',
];

function extractJsonBlock(text: string) {
  const jsonBlock = text.match(/```json\s*([\s\S]*?)\s*```/);

  if (jsonBlock?.[1]) {
    try {
      return JSON.parse(jsonBlock[1]);
    } catch {
      return null;
    }
  }

  const looseJson = text.match(/\{[\s\S]*?\}/);

  if (looseJson?.[0]) {
    try {
      return JSON.parse(looseJson[0]);
    } catch {
      return null;
    }
  }

  return null;
}

export default function ProblemMapperPage() {
  const navigate = useNavigate();

  const [input, setInput] = React.useState('');
  const [analysis, setAnalysis] = React.useState('');
  const [responsiblePoliticianId, setResponsiblePoliticianId] = React.useState<string | null>(null);
  const [jurisdiction, setJurisdiction] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { data: politician } = trpc['politician.getFullProfile'].useQuery(
    { id: responsiblePoliticianId! },
    { enabled: !!responsiblePoliticianId }
  );

  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setAnalysis('');
      setResponsiblePoliticianId(null);
      setJurisdiction(null);

      const response = await fetch('/api/ai/problem-mapper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ problem: input }),
      });

      if (!response.ok) {
        throw new Error(`Problem mapper failed with status ${response.status}`);
      }

      const text = await response.text();
      setAnalysis(text.split('```json')[0].trim());

      const parsed = extractJsonBlock(text);

      if (parsed?.politicianId) {
        setResponsiblePoliticianId(parsed.politicianId);
        setJurisdiction(parsed.level || null);
      } else {
        setResponsiblePoliticianId('p1');
        setJurisdiction('MLA');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyse problem');
      setAnalysis(
        'This issue appears to involve local civic infrastructure. The likely responsible authority is your MLA or ward-level representative.'
      );
      setResponsiblePoliticianId('p1');
      setJurisdiction('MLA');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setInput('');
    setAnalysis('');
    setResponsiblePoliticianId(null);
    setJurisdiction(null);
    setError(null);
  };

  return (
    <div className="page-enter mx-auto max-w-7xl py-8 pb-32">
      <button
        onClick={() => navigate('/more')}
        className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} /> Back to More
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-core/10 border border-green-core/20 text-green-core text-[10px] font-bold uppercase tracking-widest">
              <Sparkles size={12} /> AI Jurisdiction Engine
            </div>

            <h1 className="text-5xl font-display font-bold tracking-tight text-text-primary leading-none">
              Problem <span className="text-green-core">Mapper</span>
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed">
              Describe any local civic issue. Our AI identifies the level of government responsible and the representative you need to hold accountable.
            </p>
          </div>

          <Card className="overflow-hidden border-glass-border focus-within:border-green-core/50 focus-within:ring-4 focus-within:ring-green-core/5 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 300))}
              placeholder="e.g. 'Streetlights in Jayanagar are not working properly...'"
              className="w-full min-h-[200px] p-6 bg-glass-1 border-none focus:ring-0 text-text-primary text-lg font-body resize-none placeholder:text-text-muted"
            />

            <div className="flex items-center justify-between p-4 bg-glass-2 border-t border-glass-border">
              <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono uppercase tracking-widest">
                <Info size={12} /> {input.length}/300 chars
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                size="lg"
                className="gap-2 shadow-glow"
              >
                {isLoading ? 'Analysing...' : 'Find Representative'} <Send size={18} />
              </Button>
            </div>
          </Card>

          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted px-2">
              Example Scenarios
            </p>

            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROBLEMS.map((example) => (
                <button
                  key={example}
                  onClick={() => setInput(example)}
                  className="rounded-xl bg-glass-1 border border-glass-border px-4 py-2.5 text-xs font-bold text-text-secondary hover:text-green-core hover:border-green-core/40 hover:bg-glass-2 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {analysis || isLoading ? (
              <motion.div
                key="analysis"
                initial={{ opacity: 0, x: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0)' }}
                className="space-y-8"
              >
                <Card variant="green" className="p-8 relative group">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <MessageSquare size={80} />
                  </div>

                  <div className="relative space-y-6">
                    <div className="flex items-center gap-2 text-green-core">
                      <Sparkles size={18} className="animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                        Responsibility Analysis
                      </span>
                    </div>

                    <div className="text-text-primary font-body text-xl leading-relaxed whitespace-pre-wrap">
                      {isLoading && !analysis ? 'Analysing your civic issue...' : analysis}
                      {isLoading && (
                        <span className="inline-block w-1.5 h-6 ml-2 bg-green-core animate-pulse align-middle" />
                      )}
                    </div>

                    {jurisdiction && (
                      <div className="text-[10px] font-bold uppercase tracking-widest text-green-core">
                        Responsible level: {jurisdiction}
                      </div>
                    )}

                    {error && (
                      <p className="text-xs text-status-bad">
                        {error}
                      </p>
                    )}
                  </div>
                </Card>

                {politician && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-4 px-4">
                      <div className="h-px flex-1 bg-glass-border" />
                      <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                        Identified Authority
                      </div>
                      <div className="h-px flex-1 bg-glass-border" />
                    </div>

                    <PoliticianMiniCard politician={politician} />

                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        className="gap-2 text-text-muted hover:text-green-core"
                        onClick={reset}
                      >
                        <RefreshCw size={16} /> Describe Another Issue
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[500px] rounded-3xl border-2 border-dashed border-glass-border bg-glass-1 flex flex-col items-center justify-center text-center p-12 space-y-6"
              >
                <div className="h-20 w-20 rounded-full bg-glass-2 border border-glass-border flex items-center justify-center text-text-muted/30">
                  <MessageSquare size={40} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-display font-bold text-text-muted">
                    Analysis Console Idle
                  </h3>

                  <p className="text-sm text-text-muted/60 max-w-sm">
                    Enter a civic problem description to trigger the jurisdiction analysis engine.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}