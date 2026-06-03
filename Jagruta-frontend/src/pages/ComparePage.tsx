import * as React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { PoliticianMiniCard } from '../components/politician/MiniCard';
import { MetricRow, ComparisonHeader } from '../components/compare/CompareElements';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowLeftRight, Share2, Search, HelpCircle, Map } from 'lucide-react';
import { useAppStore } from '../store/app.store';

export default function ComparePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const idA = searchParams.get('a');
  const idB = searchParams.get('b');

  const { setComparePoliticians } = useAppStore();

  React.useEffect(() => {
    setComparePoliticians([idA || '', idB || '']);
  }, [idA, idB, setComparePoliticians]);

  const { data: pA, isLoading: isALoading } = trpc['politician.getFullProfile'].useQuery(
    { id: idA! },
    { enabled: !!idA }
  );

  const { data: pB, isLoading: isBLoading } = trpc['politician.getFullProfile'].useQuery(
    { id: idB! },
    { enabled: !!idB }
  );

  const handleSwap = () => {
    if (!idA && !idB) return;

    const nextParams: Record<string, string> = {};

    if (idB) nextParams.a = idB;
    if (idA) nextParams.b = idA;

    setSearchParams(nextParams);
  };

  const handleShareComparison = async () => {
    const text = `Compare ${pA?.name || 'Candidate A'} and ${pB?.name || 'Candidate B'} on JAGRUTA: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'JAGRUTA Candidate Comparison',
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Comparison link copied to clipboard!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const metrics = [
    { label: 'Performance Score', key: 'score', higherIsBetter: true },
    { label: 'Attendance %', key: 'attendance', higherIsBetter: true },
    { label: 'Years in Office', key: 'yearsInOffice', higherIsBetter: true },
    { label: 'Criminal Cases', key: 'criminalCases', higherIsBetter: false },
  ];

  if (!idA || !idB) {
    return (
      <div className="page-enter flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 px-4 pt-12 overflow-hidden w-full">
        <div className="h-24 w-24 rounded-3xl bg-glass-1 border border-glass-border flex items-center justify-center text-green-core shadow-glow rotate-12">
          <ArrowLeftRight size={40} />
        </div>

        <div className="space-y-4 max-w-xl">
          <h1 className="text-4xl font-display font-bold text-text-primary tracking-tight">
            Compare Candidates
          </h1>

          <p className="text-base text-text-secondary leading-relaxed">
            Side-by-side analysis of legislative performance, attendance records, and criminal cases.
          </p>

          {idA && !idB && (
            <p className="text-xs text-green-core font-bold uppercase tracking-widest">
              Candidate A selected. Choose another representative from the map or use the example.
            </p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 w-full max-w-xs">
          <Button
            size="lg"
            className="w-full"
            onClick={() => setSearchParams({ a: idA || 'p1', b: 'p2' })}
          >
            Try Example Comparison
          </Button>

          <Button variant="secondary" size="lg" className="gap-2 w-full" asChild>
            <Link to="/map">
              <Map size={18} /> Pick From Map
            </Link>
          </Button>

          <Button variant="ghost" size="lg" className="gap-2 w-full" asChild>
            <Link to="/">
              <Search size={18} /> Find By Pincode
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto w-full px-4 max-w-4xl space-y-8 py-8 pb-32 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center gap-8 sm:gap-4 relative px-2">
        <div className="w-full space-y-4">
          <div className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
            Representative A
          </div>

          {isALoading ? (
            <div className="skeleton h-64 rounded-2xl w-full" />
          ) : pA ? (
            <PoliticianMiniCard politician={pA} />
          ) : (
            <Card className="h-64 border-dashed flex items-center justify-center text-text-muted italic">
              Select politician A
            </Card>
          )}
        </div>

        <div className="flex justify-center z-10 shrink-0 sm:pt-10">
          <button
            onClick={handleSwap}
            className="h-14 w-14 rounded-2xl bg-bg-void border border-glass-border flex items-center justify-center text-green-core hover:scale-110 transition-all shadow-2xl group"
          >
            <ArrowLeftRight
              size={24}
              className="group-hover:rotate-180 transition-transform duration-500 rotate-90 sm:rotate-0"
            />
          </button>
        </div>

        <div className="w-full space-y-4">
          <div className="px-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] sm:text-right">
            Representative B
          </div>

          {isBLoading ? (
            <div className="skeleton h-64 rounded-2xl w-full" />
          ) : pB ? (
            <PoliticianMiniCard politician={pB} />
          ) : (
            <Card className="h-64 border-dashed flex items-center justify-center text-text-muted italic">
              Select politician B
            </Card>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <ComparisonHeader pA={pA} pB={pB} />

        <div className="divide-y divide-glass-border">
          {metrics.map((m) => (
            <MetricRow
              key={m.label}
              label={m.label}
              valA={pA ? (pA as any)[m.key] ?? 0 : '...'}
              valB={pB ? (pB as any)[m.key] ?? 0 : '...'}
              higherIsBetter={m.higherIsBetter}
            />
          ))}
        </div>

        <div className="p-6 bg-glass-1 flex items-center justify-center gap-2 text-xs text-text-muted font-body">
          <HelpCircle size={14} />
          Scores are calculated from performance, attendance, experience, and criminal case data.
        </div>
      </Card>

      <div className="flex flex-col items-center gap-6">
        <Button size="lg" className="gap-2 min-w-[240px]" onClick={handleShareComparison}>
          <Share2 size={18} /> Share This Comparison
        </Button>

        <Button variant="secondary" size="md" onClick={() => navigate('/map')}>
          Pick Different Candidates
        </Button>

        <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">
          Data verified from backend database
        </p>
      </div>
    </div>
  );
}