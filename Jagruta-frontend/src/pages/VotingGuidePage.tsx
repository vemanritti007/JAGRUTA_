import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/app.store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  Star,
  Info,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CandidateRankCard } from '../components/ai/VotingGuideElements';
import { trpc } from '../lib/trpc';
import { mockPoliticians } from '../lib/mocks';

const QUESTIONS = [
  { id: 'infrastructure', label: 'Infrastructure', sub: 'Roads, Water, Electricity, Public Transport' },
  { id: 'employment', label: 'Employment', sub: 'Jobs, Industry Growth, Skill Development' },
  { id: 'education', label: 'Education', sub: 'Schools, Colleges, Educational Infrastructure' },
  { id: 'safety', label: 'Public Safety', sub: 'Crime Prevention, Police Reforms, Urban Lighting' },
  { id: 'healthcare', label: 'Healthcare', sub: 'Hospitals, Clinics, Public Health Initiatives' },
];

const OPTIONS = [
  { label: 'Not important', value: 1 },
  { label: 'Somewhat important', value: 2 },
  { label: 'Very important', value: 3 },
  { label: 'Top priority', value: 4 },
];

export default function VotingGuidePage() {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(0);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [priorities, setPriorities] = React.useState<Record<string, number>>({});
  const [aiReasoning, setAiReasoning] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { pincode } = useAppStore();

  const { data: apiPoliticians } = trpc['politician.getByLayer'].useQuery(
    { layer: 'assembly' },
    { retry: false }
  );

  const candidates = React.useMemo(() => {
    if (apiPoliticians && apiPoliticians.length > 0) {
      return apiPoliticians.slice(0, 3).map((p: any) => ({
        id: p.id,
        name: p.name,
        party: p.party,
        level: p.level,
        imageUrl: p.photo || p.imageUrl || '',
        score: p.score || 70,
        attendance: p.attendance || 75,
        criminalCases: p.criminal?.caseCount || 0,
      }));
    }

    return mockPoliticians.slice(0, 3).map((p: any) => ({
      ...p,
      imageUrl: p.imageUrl || '',
    }));
  }, [apiPoliticians]);

  const handleSelect = (value: number) => {
    setPriorities((prev) => ({ ...prev, [QUESTIONS[step].id]: value }));

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setStep((prev) => {
        if (prev < QUESTIONS.length - 1) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return prev + 1;
        }
        return prev;
      });
    }, 350);
  };

  const calculateMatchScore = (candidate: any, index: number) => {
    const infrastructureWeight = priorities.infrastructure || 1;
    const safetyWeight = priorities.safety || 1;
    const base = candidate.score || 70;
    const attendance = candidate.attendance || 75;
    const criminalPenalty = (candidate.criminalCases || 0) * safetyWeight * 3;
    const bonus = infrastructureWeight * 3;

    return Math.max(
      45,
      Math.min(98, Math.round(base * 0.55 + attendance * 0.25 + bonus - criminalPenalty - index * 5))
    );
  };

  const handleGenerate = async () => {
    try {
      setStep(QUESTIONS.length);
      setIsGenerating(true);
      setError(null);
      setAiReasoning('');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const response = await fetch('/api/ai/voting-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pincode,
          priorities,
          candidates,
        }),
      });

      if (!response.ok) {
        throw new Error(`Voting guide failed with status ${response.status}`);
      }

      const text = await response.text();
      setAiReasoning(text);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate voting guide');
      setAiReasoning(
        'Based on your priorities, the top-ranked candidate appears to be the best match because of stronger civic score, attendance, and issue alignment. This is a neutral guide, not an endorsement.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setStep(0);
    setPriorities({});
    setAiReasoning('');
    setError(null);
    setIsGenerating(false);
  };

  const matchedCandidates = candidates.map((p: any, i: number) => ({
    ...p,
    matchScore: calculateMatchScore(p, i),
    reasoning:
      aiReasoning ||
      `${p.name} is ranked based on civic score, attendance, criminal case count, and your selected issue priorities.`,
  }));

  return (
    <div className="page-enter mx-auto max-w-4xl py-12 px-4 pb-32">
      <button
        onClick={() => navigate('/more')}
        className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} /> Back to More
      </button>

      <AnimatePresence mode="wait">
        {step < QUESTIONS.length ? (
          <motion.div
            key={`wizard-step-${step}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="space-y-8"
          >
            <div className="space-y-4 text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-core/10 border border-green-core/20 text-green-core text-[10px] font-bold uppercase tracking-widest">
                <Star size={12} fill="currentColor" /> Personal Voting Compass
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1.5 w-12 rounded-full transition-all duration-500',
                    i < step ? 'bg-green-core' : i === step ? 'bg-green-core shadow-glow' : 'bg-glass-2'
                  )}
                />
              ))}
            </div>

            <Card className="p-8 md:p-12 space-y-10 relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-core/30 to-transparent opacity-50" />

              <div className="space-y-4 text-center">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-green-core block">
                  Question {step + 1} of {QUESTIONS.length}
                </span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-text-primary tracking-tight leading-tight">
                  How important is <span className="text-green-core">{QUESTIONS[step].label}</span>?
                </h2>
                <p className="text-lg text-text-secondary bg-glass-1 inline-block px-4 py-1.5 rounded-full border border-glass-border">
                  {QUESTIONS[step].sub}
                </p>
              </div>

              <div className="flex flex-col gap-3 max-w-2xl mx-auto mt-8">
                {OPTIONS.map((opt) => {
                  const isSelected = priorities[QUESTIONS[step].id] === opt.value;

                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        'flex items-center justify-between p-5 rounded-xl border transition-all text-left group/opt',
                        isSelected
                          ? 'bg-green-core/10 border-green-core shadow-[0_0_15px_rgba(16,185,129,0.15)] ring-1 ring-green-core'
                          : 'bg-glass-1 border-glass-border hover:border-glass-border-bright hover:bg-glass-2 hover:translate-x-1'
                      )}
                    >
                      <span
                        className={cn(
                          'font-bold uppercase tracking-widest text-sm',
                          isSelected ? 'text-green-core' : 'text-text-primary'
                        )}
                      >
                        {opt.label}
                      </span>

                      <div
                        className={cn(
                          'h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300',
                          isSelected
                            ? 'text-green-core scale-110'
                            : 'text-transparent border-2 border-glass-border group-hover/opt:border-glass-border-bright'
                        )}
                      >
                        {isSelected && <CheckCircle2 size={24} className="animate-in zoom-in duration-200" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>

            <div className="flex justify-between items-center gap-4 px-4 max-w-2xl mx-auto">
              <button
                disabled={step === 0}
                onClick={() => setStep(step - 1)}
                className="flex shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-text-primary disabled:opacity-0 transition-opacity"
              >
                <ChevronLeft size={16} /> Back
              </button>

              {step === QUESTIONS.length - 1 && priorities[QUESTIONS[step].id] && (
                <Button onClick={handleGenerate} size="lg" className="shadow-glow animate-in fade-in slide-in-from-bottom-4">
                  Confirm &amp; Generate
                  <ChevronRight className="ml-2" size={18} />
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            {isGenerating && !aiReasoning ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-8">
                <div className="relative">
                  <div className="h-24 w-24 animate-spin rounded-full border-2 border-green-core border-b-transparent shadow-glow" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-core" size={32} />
                </div>
                <div className="text-center space-y-3">
                  <p className="font-mono text-sm uppercase tracking-[0.3em] text-green-core animate-pulse">
                    Calculating Alignment Scores...
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-widest">
                    Cross-referencing candidate data
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-core text-[10px] font-bold uppercase tracking-widest">
                      <ShieldCheck size={14} /> Analysis Complete
                    </div>
                    <h2 className="text-4xl font-display font-bold tracking-tight text-text-primary">
                      Your Ranked <span className="text-green-core">Guide</span>
                    </h2>
                    <p className="text-sm text-text-muted font-bold uppercase tracking-widest">
                      Optimized for Pincode {pincode || 'your area'}
                    </p>
                    {error && <p className="text-xs text-status-bad">{error}</p>}
                  </div>

                  <Button variant="secondary" size="md" onClick={reset} className="gap-2">
                    <RefreshCw size={14} /> Restart Analysis
                  </Button>
                </div>

                <div className="space-y-6">
                  {matchedCandidates.map((c: any, i: number) => (
                    <CandidateRankCard
                      key={c.id}
                      rank={i + 1}
                      candidate={c}
                      matchScore={c.matchScore}
                      reasoning={c.reasoning}
                    />
                  ))}
                </div>

                <Card variant="green" className="p-8 text-center space-y-4">
                  <div className="flex justify-center text-green-core mb-2">
                    <Info size={32} />
                  </div>
                  <h3 className="text-xl font-display font-bold text-text-primary">
                    Understanding these results
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-lg mx-auto">
                    This guide is based on available candidate data and your selected priorities. It does not represent an endorsement.
                  </p>
                </Card>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}