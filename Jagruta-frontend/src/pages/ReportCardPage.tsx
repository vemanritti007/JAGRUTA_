import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  Info,
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  Share2,
  MapPin,
  Search,
  ChevronLeft,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/app.store';
import { motion } from 'framer-motion';

type ConstituencyOption = {
  id: string;
  name: string;
};

type ReportSection = {
  title: string;
  score: number;
  status: string;
  description: string;
};

function getGrade(score: number) {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function getStatusIcon(status: string) {
  const clean = String(status || '').toLowerCase();

  if (clean === 'good') {
    return <TrendingUp size={20} className="text-green-core" />;
  }

  if (clean === 'average') {
    return <BarChart3 size={20} className="text-gold-core" />;
  }

  return <TrendingDown size={20} className="text-status-bad" />;
}

function getStatusColor(status: string) {
  const clean = String(status || '').toLowerCase();

  if (clean === 'good') return 'text-green-core border-green-core/30 bg-green-core/10';
  if (clean === 'average') return 'text-gold-core border-gold-core/30 bg-gold-core/10';

  return 'text-status-bad border-status-bad/30 bg-status-bad/10';
}

function normalizeSections(report: any): ReportSection[] {
  if (Array.isArray(report?.sections)) {
    return report.sections.map((section: any) => ({
      title: section.title || 'Report Section',
      score: Number(section.score || 0),
      status: section.status || 'average',
      description: section.description || '',
    }));
  }

  const sections = report?.sections || {};
  const fallbackScore = Number(report?.overallScore || 0);

  const output: ReportSection[] = [];

  if (sections.infrastructure) {
    const completed = Number(sections.infrastructure.completed || 0);
    const promised = Number(sections.infrastructure.promised || 0);
    const score = promised > 0 ? Math.round((completed / promised) * 100) : fallbackScore;

    output.push({
      title: 'Infrastructure',
      score,
      status: score >= 70 ? 'good' : score >= 50 ? 'average' : 'poor',
      description: `${completed}/${promised} infrastructure projects completed.`,
    });
  }

  if (sections.turnout) {
    const history = sections.turnout.history || [];
    const latest = history.length > 0 ? Number(history[history.length - 1]?.value || 0) : fallbackScore;

    output.push({
      title: 'Civic Engagement',
      score: latest,
      status: sections.turnout.trend === 'improving' ? 'good' : 'average',
      description: `Voter turnout trend is ${sections.turnout.trend || 'available'}.`,
    });
  }

  if (output.length === 0) {
    output.push(
      {
        title: 'Representative Performance',
        score: fallbackScore,
        status: fallbackScore >= 70 ? 'good' : fallbackScore >= 55 ? 'average' : 'poor',
        description: 'Representative score based on available constituency indicators.',
      },
      {
        title: 'Assembly Attendance',
        score: fallbackScore,
        status: fallbackScore >= 70 ? 'good' : fallbackScore >= 55 ? 'average' : 'poor',
        description: 'Attendance indicator based on available representative data.',
      },
      {
        title: 'Civic Complaint Resolution',
        score: fallbackScore,
        status: fallbackScore >= 70 ? 'good' : fallbackScore >= 55 ? 'average' : 'poor',
        description: 'Complaint score based on fulfilled vs pending civic complaints.',
      },
      {
        title: 'Criminal Case Indicator',
        score: fallbackScore,
        status: fallbackScore >= 70 ? 'good' : fallbackScore >= 55 ? 'average' : 'poor',
        description: 'Indicator based on declared criminal case data.',
      }
    );
  }

  return output;
}

export default function ReportCardPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pincode } = useAppStore();

  const [selectedConstituencyId, setSelectedConstituencyId] = React.useState<string>(id || '');

  const {
    data: representatives = [],
    isLoading: representativesLoading,
  } = (trpc as any)['politician.getByLayer'].useQuery({
    layer: 'assembly',
  });

  const constituencyOptions = React.useMemo<ConstituencyOption[]>(() => {
    const map = new Map<string, ConstituencyOption>();

    (representatives || []).forEach((representative: any) => {
      if (!representative?.constituencyId || !representative?.constituencyName) {
        return;
      }

      map.set(representative.constituencyId, {
        id: representative.constituencyId,
        name: representative.constituencyName,
      });
    });

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [representatives]);

  React.useEffect(() => {
    if (!selectedConstituencyId && constituencyOptions.length > 0) {
      setSelectedConstituencyId(constituencyOptions[0].id);
    }
  }, [selectedConstituencyId, constituencyOptions]);

  const activeConstituencyId =
    selectedConstituencyId || id || constituencyOptions[0]?.id || 'c1';

  const {
    data: report,
    isLoading: reportLoading,
  } = (trpc as any)['constituency.getReportCard'].useQuery(
    {
      id: activeConstituencyId,
    },
    {
      enabled: Boolean(activeConstituencyId),
    }
  );

  const selectedConstituency = React.useMemo(() => {
    return constituencyOptions.find((item) => item.id === activeConstituencyId);
  }, [constituencyOptions, activeConstituencyId]);

  const constituencyName =
    report?.constituencyName ||
    selectedConstituency?.name ||
    'Selected Constituency';

  const overallScore = Number(report?.overallScore || 0);
  const grade = report?.grade || getGrade(overallScore);
  const reportSections = React.useMemo(() => normalizeSections(report), [report]);

  const chartData = React.useMemo(() => {
    return reportSections.map((section) => ({
      name: section.title,
      value: section.score,
    }));
  }, [reportSections]);

  const gradeColors: Record<string, string> = {
    A: 'text-green-core border-green-core shadow-[0_0_40px_rgba(0,255,135,0.3)]',
    B: 'text-green-core/80 border-green-core/40',
    C: 'text-gold-core border-gold-core shadow-[0_0_40px_rgba(255,215,0,0.2)]',
    D: 'text-status-bad/80 border-status-bad/40',
    F: 'text-status-bad border-status-bad shadow-[0_0_40px_rgba(255,59,92,0.3)]',
    'N/A': 'text-text-muted border-glass-border',
  };

  const handleShare = () => {
    const text = `${constituencyName} scored ${grade} with ${overallScore}/100 on JAGRUTA.`;

    navigator.clipboard.writeText(text);
    alert('Report card summary copied to clipboard!');
  };

  if (representativesLoading || reportLoading) {
    return (
      <div className="page-enter mx-auto max-w-6xl space-y-12 py-8">
        <div className="skeleton h-[400px] rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skeleton h-64 rounded-3xl" />
          <div className="skeleton h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter mx-auto max-w-6xl py-8 pb-32">
      <button
        onClick={() => navigate('/more')}
        className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
      >
        <ChevronLeft size={16} /> Back to More
      </button>

      <Card className="mb-8 p-5 bg-bg-void/80 backdrop-blur-xl border-glass-border rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted">
              <Search size={14} /> Choose Constituency
            </div>

            <p className="text-sm text-text-secondary">
              Select any Bengaluru constituency to generate its report card directly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <select
              value={activeConstituencyId}
              onChange={(event) => setSelectedConstituencyId(event.target.value)}
              className="w-full lg:w-[320px] rounded-xl border border-glass-border bg-bg-inset px-4 py-3 text-sm font-bold text-text-primary outline-none focus:border-green-core"
            >
              {constituencyOptions.map((option) => (
                <option key={option.id} value={option.id} className="bg-bg-void">
                  {option.name}
                </option>
              ))}
            </select>

            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => navigate(`/map?constituencyId=${activeConstituencyId}`)}
            >
              <MapPin size={16} /> Open Map
            </Button>
          </div>
        </div>
      </Card>

      <section className="glass-elevated p-12 relative overflow-hidden group flex flex-col items-center text-center space-y-8 mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-green-core/5 to-transparent pointer-events-none" />

        <div className="space-y-4 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-glass-2 border border-glass-border text-text-muted text-[10px] font-bold uppercase tracking-widest">
            <MapPin size={12} /> Local Accountability Report
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-bold text-text-primary tracking-tight">
            Constituency <span className="text-green-core">Report Card</span>
          </h1>

          <p className="text-xl text-text-secondary font-body uppercase tracking-[0.2em]">
            {constituencyName} {pincode ? `· ${pincode}` : ''}
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className={cn(
            'h-48 w-48 rounded-full border-4 flex flex-col items-center justify-center bg-bg-void/50 backdrop-blur-2xl relative z-10 transition-all duration-1000',
            gradeColors[grade || 'C']
          )}
        >
          <span className="text-8xl font-display font-bold leading-none">
            {grade}
          </span>

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Overall Grade
          </span>
        </motion.div>

        <div className="w-full max-w-lg space-y-4 relative">
          <div className="flex justify-between items-end px-2">
            <div className="text-left">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Performance Score
              </div>

              <div className="text-2xl font-mono font-bold text-text-primary">
                {overallScore}/100
              </div>
            </div>

            <Badge variant="default" className="bg-green-core/10 text-green-core border-green-core/20">
              Real DB Score
            </Badge>
          </div>

          <div className="h-3 w-full rounded-full bg-glass-1 overflow-hidden border border-glass-border relative p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallScore}%` }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
              className="h-full bg-green-core rounded-full shadow-glow"
            />
          </div>
        </div>

        <div className="flex gap-4 relative">
          <Button size="lg" className="gap-2 shadow-glow" onClick={handleShare}>
            <Share2 size={18} /> Share Results
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="gap-2"
            onClick={() => navigate(`/map?constituencyId=${activeConstituencyId}`)}
          >
            <Search size={18} /> View on Map
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reportSections.map((section) => (
          <Card key={section.title} className="p-8 space-y-6 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    'p-3 rounded-2xl border group-hover:scale-110 transition-transform',
                    getStatusColor(section.status)
                  )}
                >
                  {section.title.toLowerCase().includes('complaint') ? (
                    <CheckCircle2 size={24} />
                  ) : section.title.toLowerCase().includes('criminal') ? (
                    <ShieldAlert size={24} />
                  ) : section.title.toLowerCase().includes('attendance') ? (
                    <Users size={24} />
                  ) : (
                    <Building2 size={24} />
                  )}
                </div>

                <div>
                  <h3 className="text-2xl font-display font-bold text-text-primary uppercase tracking-tight">
                    {section.title}
                  </h3>

                  <p className="text-xs text-text-muted mt-1">
                    {section.status}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getStatusIcon(section.status)}

                <div className="text-3xl font-display font-bold text-green-core">
                  {section.score}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-text-secondary leading-relaxed">
                {section.description}
              </p>

              <div className="h-2 w-full rounded-full bg-glass-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${section.score}%` }}
                  transition={{ duration: 1.2 }}
                  className="h-full bg-green-core shadow-glow"
                />
              </div>
            </div>
          </Card>
        ))}

        <Card className="md:col-span-2 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gold-core/10 text-gold-core">
                <BarChart3 size={24} />
              </div>

              <h3 className="text-2xl font-display font-bold text-text-primary uppercase tracking-tight">
                Section Score Overview
              </h3>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReportScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold-core)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--gold-core)" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <XAxis dataKey="name" hide />
                <YAxis hide domain={[0, 100]} />

                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 13, 20, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                  }}
                  itemStyle={{
                    color: 'var(--gold-core)',
                    fontWeight: 'bold',
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--gold-core)"
                  fillOpacity={1}
                  fill="url(#colorReportScore)"
                  strokeWidth={4}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card variant="green" className="mt-12 p-8 flex items-start gap-6">
        <div className="p-3 rounded-2xl bg-green-core/10 text-green-core">
          <Info size={24} />
        </div>

        <div className="space-y-2">
          <p className="text-lg text-text-primary font-bold">
            Grading Methodology
          </p>

          <p className="text-sm text-text-secondary leading-relaxed max-w-5xl">
            This report card is generated from representative performance score,
            attendance, civic complaint resolution, and declared criminal case indicators.
            Choose another constituency from the dropdown to view its report directly.
          </p>
        </div>
      </Card>
    </div>
  );
}