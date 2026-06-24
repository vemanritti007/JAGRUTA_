import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { useAppStore } from '../store/app.store';
import { WinnerCard, ResultsTable, VoteShareDonut } from '../components/election/ElectionElements';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { BarChart3, TrendingUp, TrendingDown, Info, Download, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';

export default function ElectionResultsPage() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = React.useState(2023);
  const { pincode } = useAppStore();

  const { data: results, isLoading } = trpc['election.getResults'].useQuery({
    years: [selectedYear],
    constituencyId: 'c1',
  });

  const years = [2014, 2018, 2019, 2023, 2024];

  const activeResult = results?.[0];
  const winner = activeResult?.candidates?.find((candidate: any) => candidate.status === 'WINNER');
  const turnoutTrend = activeResult?.turnoutTrend ?? 2.4;

  const handleExportCSV = () => {
    if (!activeResult?.candidates?.length) {
      alert('No election data available to export.');
      return;
    }

    const headers = [
      'Year',
      'Constituency',
      'Candidate',
      'Party',
      'Votes',
      'Vote Percentage',
      'Status',
    ];

    const rows = activeResult.candidates.map((candidate: any) => [
      selectedYear,
      activeResult.constituencyName || 'Sarvagnanagar Assembly Constituency',
      candidate.name,
      candidate.party,
      candidate.votes,
      `${candidate.votePercentage}%`,
      candidate.status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `jagruta-election-results-${selectedYear}.csv`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="page-enter mx-auto max-w-6xl space-y-12 py-8">
        <div className="skeleton h-20 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <div className="skeleton h-64 rounded-3xl" />
          </div>
          <div className="md:col-span-4">
            <div className="skeleton h-64 rounded-3xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton h-80 rounded-3xl" />
          <div className="skeleton h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-12 py-8 pb-32">
      <button
        onClick={() => navigate('/more')}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} /> Back to More
      </button>

      <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-glass-border pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass-2 border border-glass-border text-text-muted text-[10px] font-bold uppercase tracking-widest">
            <BarChart3 size={12} /> Historical Data Archive
          </div>

          <h1 className="text-5xl font-display font-bold text-text-primary tracking-tight leading-none">
            Election <span className="text-green-core">Results</span>
          </h1>

          <p className="text-lg text-text-secondary font-body uppercase tracking-[0.2em]">
            {activeResult?.constituencyName || 'Sarvagnanagar Assembly Constituency'}
            {pincode ? ` · ${pincode}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 p-1.5 bg-glass-1 rounded-2xl border border-glass-border">
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={cn(
                'rounded-xl px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300',
                selectedYear === year
                  ? 'bg-green-core text-bg-void shadow-glow'
                  : 'text-text-muted hover:text-text-primary hover:bg-glass-2'
              )}
            >
              {year}
            </button>
          ))}
        </div>
      </section>

      {!activeResult ? (
        <Card className="p-12 text-center space-y-4">
          <h2 className="text-2xl font-display font-bold text-text-primary">
            No result found for {selectedYear}
          </h2>
          <p className="text-sm text-text-secondary">
            Try another year from the filter above.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              {winner ? (
                <WinnerCard candidate={winner} />
              ) : (
                <Card className="p-8 text-center text-text-muted">
                  Winner data unavailable.
                </Card>
              )}
            </div>

            <div className="lg:col-span-4">
              <Card className="h-full p-8 flex flex-col justify-center items-center text-center space-y-4 group">
                <div className="p-4 rounded-3xl bg-green-core/10 text-green-core group-hover:scale-110 transition-transform duration-500">
                  {turnoutTrend >= 0 ? <TrendingUp size={32} /> : <TrendingDown size={32} />}
                </div>

                <div className="space-y-1">
                  <h3 className="font-mono text-5xl font-bold text-text-primary tracking-tighter">
                    {activeResult.turnout || 0}%
                  </h3>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                    Voter Turnout
                  </p>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold',
                    turnoutTrend >= 0
                      ? 'bg-status-good/10 text-status-good'
                      : 'bg-status-bad/10 text-status-bad'
                  )}
                >
                  {turnoutTrend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {turnoutTrend >= 0 ? '+' : ''}
                  {turnoutTrend}% from previous
                </div>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <Card className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold text-text-primary uppercase tracking-tight">
                    Vote Share
                  </h3>
                  <Badge variant="default" className="bg-glass-2">
                    BY PARTY
                  </Badge>
                </div>

                <div className="min-h-[420px] flex items-center justify-center">
                    <VoteShareDonut candidates={activeResult.candidates} />
                </div>
              </Card>
            </div>

            <div className="lg:col-span-7">
              <Card className="overflow-hidden">
                <div className="p-6 bg-glass-1 border-b border-glass-border flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold text-text-primary uppercase tracking-tight">
                    Detailed Breakdown
                  </h3>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-text-muted hover:text-green-core gap-2"
                    onClick={handleExportCSV}
                  >
                    <Download size={14} /> Export CSV
                  </Button>
                </div>

                <ResultsTable candidates={activeResult.candidates} />
              </Card>
            </div>
          </div>
        </>
      )}

      <Card variant="green" className="p-6 flex items-start gap-4">
        <div className="p-2 rounded-lg bg-green-core/10 text-green-core">
          <Info size={20} />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-text-primary font-bold">Verification Notice</p>
          <p className="text-xs text-text-secondary leading-relaxed">
            This page currently uses mock election data from the backend. Replace it with official ECI/Form-20 data later for real public release.
          </p>
        </div>
      </Card>
    </div>
  );
}