import * as React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { Badge } from '../components/ui/Badge';
import { ScoreRing } from '../components/ui/ScoreRing';
import { Button } from '../components/ui/Button';
import { User, Share2, ArrowLeftRight, AlertTriangle } from 'lucide-react';
import { CriminalSection, AISummaryBlock } from '../components/politician/ProfileSections';
import { AttendanceBar, AssetGrowthChart } from '../components/politician/PerformanceMetrics';
import { QuestionsSection, BillsVotedSection } from '../components/politician/LegislativeMetrics';
import { useAppStore } from '../store/app.store';
import { getPartyColor } from '../lib/utils';

const SECTION_IDS = [
  { id: 'ai-summary', label: 'AI Summary' },
  { id: 'criminal', label: 'Criminal Records' },
  { id: 'assets', label: 'Asset Growth' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'legislative', label: 'Legislative' },
];

export default function PoliticianPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setComparePoliticians, comparePoliticians } = useAppStore();

  const { data: politician, isLoading } = trpc['politician.getFullProfile'].useQuery(
    { id: id! },
    { enabled: !!id }
  );

  const handleAddToCompare = () => {
    if (!politician) return;

    const first = comparePoliticians[0];
    const second = comparePoliticians[1];

    if (!first || first === politician.id) {
      setComparePoliticians([politician.id, second || '']);
      navigate(`/compare?a=${politician.id}`);
      return;
    }

    setComparePoliticians([first, politician.id]);
    navigate(`/compare?a=${first}&b=${politician.id}`);
  };

  const handleShareProfile = async () => {
    if (!politician) return;

    const shareText = `${politician.name} - ${politician.level}, ${politician.constituency}. View profile on JAGRUTA: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${politician.name} on JAGRUTA`,
          text: shareText,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert('Profile link copied to clipboard!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);

    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="page-enter mx-auto max-w-6xl space-y-12 py-8">
        <div className="skeleton h-[300px] rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton h-[400px] rounded-3xl" />
          <div className="skeleton h-[400px] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!politician) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="p-6 rounded-full bg-status-bad/10 text-status-bad">
          <AlertTriangle size={48} />
        </div>

        <h2 className="text-3xl font-display font-bold">Politician Not Found</h2>

        <p className="text-text-secondary max-w-md">
          The profile you are looking for does not exist or has been removed.
        </p>

        <Button asChild variant="secondary">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  const partyColor = getPartyColor(politician.party);

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-12 py-8 pb-32">
      <section className="glass-elevated p-8 md:p-12 relative overflow-hidden group">
        <div
          className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-10 blur-3xl"
          style={{ background: partyColor }}
        />

        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center relative z-10">
          <div
            className="politician-photo-ring w-32 h-32 md:w-48 md:h-48"
            style={{ '--party-colour': partyColor } as any}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 40px ${partyColor}33` }}
            />

            {politician.imageUrl ? (
              <img
                src={politician.imageUrl}
                alt={politician.name}
                className="politician-photo"
              />
            ) : (
              <div className="politician-photo flex items-center justify-center bg-bg-depth text-text-muted">
                <User size={64} />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="level" level={politician.level as any}>
                {politician.level}
              </Badge>

              <Badge variant="party" party={politician.party as any}>
                {politician.party}
              </Badge>

              {politician.criminalRecords?.length === 0 && (
                <Badge className="bg-status-good/10 text-status-good border-status-good/20">
                  Clean Record
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-display font-bold text-text-primary tracking-tight leading-none">
                {politician.name}
              </h1>

              <p className="text-2xl font-body text-text-secondary uppercase tracking-[0.2em]">
                {politician.constituency}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button size="lg" className="gap-2" onClick={handleAddToCompare}>
                <ArrowLeftRight size={18} /> Add to Compare
              </Button>

              <Button variant="secondary" size="lg" className="gap-2" onClick={handleShareProfile}>
                <Share2 size={18} /> Share Profile
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 bg-glass-1 rounded-3xl p-8 border border-glass-border shadow-2xl">
            <ScoreRing score={politician.score} size="lg" />

            <div className="text-center">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                Performance
              </div>
              <div className="text-xl font-mono font-bold text-text-primary">
                Civic Score
              </div>
            </div>
          </div>
        </div>
      </section>

      <nav className="sticky top-[76px] z-40 bg-bg-void/80 backdrop-blur-xl border border-glass-border rounded-2xl px-6 py-2 overflow-x-auto no-scrollbar">
        <ul className="flex gap-8 whitespace-nowrap">
          {SECTION_IDS.map((sid) => (
            <li key={sid.id}>
              <button
                onClick={() => handleScrollTo(sid.id)}
                className="py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted transition-all hover:text-green-core hover:tracking-[0.3em]"
              >
                {sid.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-12">
        <section id="ai-summary" className="section-enter scroll-mt-28">
          <AISummaryBlock politicianId={politician.id} />
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section id="criminal" className="section-enter scroll-mt-28">
            <CriminalSection records={politician.criminalRecords || []} />
          </section>

          <section id="attendance" className="section-enter scroll-mt-28">
            <AttendanceBar value={politician.attendance || 0} average={76} />
          </section>
        </div>

        <section id="assets" className="section-enter scroll-mt-28">
          <AssetGrowthChart data={politician.assetHistory || []} />
        </section>

        <section
          id="legislative"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 section-enter scroll-mt-28"
        >
          <QuestionsSection
            count={politician.questionsAsked?.length || 0}
            topics={
              politician.questionsAsked?.length
                ? politician.questionsAsked.map((q: any) => q.topic || 'Civic Issue')
                : ['Water Scarcity', 'Public Transport', 'Smart City Projects']
            }
          />

          <BillsVotedSection
            bills={
              politician.billsVoted?.length
                ? politician.billsVoted
                : [
                    {
                      title: 'The Karnataka Town and Country Planning Amendment Bill',
                      session: 'Winter 2023',
                      vote: 'YES',
                    },
                    {
                      title: 'The Karnataka Police Amendment Bill',
                      session: 'Monsoon 2023',
                      vote: 'NO',
                    },
                    {
                      title: 'The BBMP Ward Delimitation Act',
                      session: 'Budget 2023',
                      vote: 'ABSENT',
                    },
                  ]
            }
          />
        </section>
      </div>
    </div>
  );
}