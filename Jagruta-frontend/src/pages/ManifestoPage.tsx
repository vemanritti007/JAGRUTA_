import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { Card } from '../components/ui/Card';
import {
  PromiseCard,
  FulfillmentMeter,
} from '../components/manifesto/ManifestoElements';
import { Button } from '../components/ui/Button';
import {
  FileText,
  Filter,
  Info,
  CheckCircle2,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '../lib/utils';

const PARTIES = ['BJP', 'INC', 'JD(S)', 'AAP'];

const CATEGORIES = [
  'Welfare',
  'Food Security',
  'Governance',
  'Housing',
  'Education',
  'Healthcare',
  'Infrastructure',
  'Transport',
  'Water',
  'Employment',
  'Women & Child',
  'Agriculture',
  'Urban Development',
  'Economy',
  'Safety',
  'Law and Justice',
  'Anti-Corruption',
  'Energy',
  'Environment',
];

function normalizeStatus(status: string | undefined) {
  const value = String(status || 'pending').toLowerCase();

  if (value === 'fulfilled') return 'fulfilled';
  if (value === 'in-progress' || value === 'in progress') return 'in-progress';
  if (value === 'broken') return 'broken';

  return 'not-started';
}

function getPartyCounts(promises: any[], party: string) {
  const partyPromises = promises.filter((promise) => promise.party === party);

  const counts = {
    fulfilled: 0,
    inProgress: 0,
    broken: 0,
    notStarted: 0,
  };

  partyPromises.forEach((promise) => {
    const status = normalizeStatus(promise.status);

    if (status === 'fulfilled') counts.fulfilled += 1;
    else if (status === 'in-progress') counts.inProgress += 1;
    else if (status === 'broken') counts.broken += 1;
    else counts.notStarted += 1;
  });

  return counts;
}

export default function ManifestoPage() {
  const navigate = useNavigate();

  const [selectedParties, setSelectedParties] = React.useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);

  const { data: promises = [], isLoading } = trpc['manifesto.getPromises'].useQuery({
    parties: selectedParties.length > 0 ? selectedParties : undefined,
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
  });

  const toggleFilter = (
    list: string[],
    item: string,
    set: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    set(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const partyScores = React.useMemo(() => {
    return PARTIES.map((party) => ({
      party,
      counts: getPartyCounts(promises as any[], party),
    }));
  }, [promises]);

  if (isLoading) {
    return (
      <div className="page-enter mx-auto max-w-6xl space-y-12 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton h-48 rounded-3xl" />
          <div className="skeleton h-48 rounded-3xl" />
        </div>

        <div className="skeleton h-16 rounded-2xl" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-64 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-12 py-8 pb-32">
      <button
        onClick={() => navigate('/more')}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors -mb-4"
      >
        <ChevronLeft size={16} /> Back to More
      </button>

      <section className="space-y-4 border-b border-glass-border pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass-2 border border-glass-border text-text-muted text-[10px] font-bold uppercase tracking-widest">
          <CheckCircle2 size={12} /> Manifesto Promise Tracker
        </div>

        <h1 className="text-5xl font-display font-bold text-text-primary tracking-tight leading-none">
          Manifesto <span className="text-green-core">Tracker</span>
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
          Compare manifesto promises from BJP, INC, JD(S), and AAP using the
          verified manifesto PDFs imported into the database.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {partyScores.map((score) => (
          <Card key={score.party} className="p-6 group relative overflow-hidden">
            <div
              className="absolute -top-12 -right-12 h-32 w-32 rounded-full opacity-10 blur-2xl"
              style={{ background: `var(--party-${score.party.toLowerCase()})` }}
            />

            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div
                  className="w-1.5 h-8 rounded-full bg-green-core"
                  style={{ background: `var(--party-${score.party.toLowerCase()})` }}
                />

                <h3 className="text-2xl font-display font-bold text-text-primary">
                  {score.party}
                </h3>
              </div>

              <div className="text-right">
                <div className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
                  Promise Rows
                </div>

                <div className="text-2xl font-mono font-bold text-green-core">
                  {Object.values(score.counts).reduce((a, b) => a + b, 0)}
                </div>
              </div>
            </div>

            <FulfillmentMeter counts={score.counts} />
          </Card>
        ))}
      </div>

      <Card className="sticky top-[76px] z-40 p-4 bg-bg-void/80 backdrop-blur-xl border-glass-border shadow-2xl rounded-2xl">
        <div className="flex items-center gap-3 md:gap-6 px-4 w-full min-w-0">
          <div className="flex items-center gap-2 shrink-0 text-text-muted border-r border-glass-border pr-3 md:pr-6">
            <Filter size={16} />

            <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
              Active Filters
            </span>
          </div>

          <div className="flex overflow-x-auto no-scrollbar gap-4 items-center w-full pb-2 -mb-2 pr-4 -mr-4">
            <div className="flex gap-2 shrink-0">
              {PARTIES.map((party) => (
                <button
                  key={party}
                  onClick={() => toggleFilter(selectedParties, party, setSelectedParties)}
                  className={cn(
                    'rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border',
                    selectedParties.includes(party)
                      ? 'bg-green-core text-bg-void border-green-core shadow-glow'
                      : 'bg-glass-1 text-text-muted border-glass-border hover:text-text-primary'
                  )}
                >
                  {party}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-glass-border shrink-0" />

            <div className="flex gap-2 shrink-0">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    toggleFilter(selectedCategories, category, setSelectedCategories)
                  }
                  className={cn(
                    'rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border',
                    selectedCategories.includes(category)
                      ? 'bg-green-core/10 text-green-core border-green-core'
                      : 'bg-glass-1 text-text-muted border-glass-border hover:text-text-primary'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:border-l lg:border-glass-border lg:pl-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-text-muted hover:text-green-core"
              onClick={() => {
                setSelectedParties([]);
                setSelectedCategories([]);
              }}
            >
              Clear All
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(promises as any[]).map((promise: any) => (
          <PromiseCard key={promise.id} promise={promise} />
        ))}

        {(promises as any[]).length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6">
            <div className="p-6 rounded-full bg-glass-1 text-text-muted/20">
              <FileText size={64} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-text-muted">
                No promises match your search
              </h3>

              <p className="text-sm text-text-muted/60 max-w-sm">
                Try adjusting your party or category filters to see more results.
              </p>
            </div>
          </div>
        )}
      </div>

      <Card variant="green" className="p-8 flex items-start gap-6">
        <div className="p-3 rounded-2xl bg-green-core/10 text-green-core">
          <Info size={24} />
        </div>

        <div className="space-y-2">
          <p className="text-lg text-text-primary font-bold">
            Methodology for Verification
          </p>

          <p className="text-sm text-text-secondary leading-relaxed max-w-4xl">
            The current rows come from the uploaded manifesto PDFs. Their status is
            shown as pending/not-started unless separate implementation evidence is
            imported later. Evidence text is displayed safely without opening invalid
            URLs.
          </p>
        </div>
      </Card>
    </div>
  );
}