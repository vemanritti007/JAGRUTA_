import * as React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { Button } from '../components/ui/Button';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Info, TrendingUp, TrendingDown, Building2, Newspaper, Users, Share2, MapPin, Search, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/app.store';
import { CompareNeighbors } from '../components/report/ReportElements';
import { motion } from 'framer-motion';

export default function ReportCardPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { pincode } = useAppStore();
  const constituencyId = id || 'c1';

  const { data: report, isLoading } = trpc['constituency.getReportCard'].useQuery({ id: constituencyId });

  const handleShare = () => {
    const text = `My constituency (${constituencyId}) scored ${report?.grade} on JAGRUTA! Check the full report card here: ${window.location.href}`;
    navigator.clipboard.writeText(text);
    alert('Report card link copied to clipboard!');
  };

  if (isLoading) {
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

  const gradeColors: Record<string, string> = {
    A: 'text-green-core border-green-core shadow-[0_0_40px_rgba(0,255,135,0.3)]',
    B: 'text-green-core/80 border-green-core/40',
    C: 'text-gold-core border-gold-core shadow-[0_0_40px_rgba(255,215,0,0.2)]',
    D: 'text-status-bad/80 border-status-bad/40',
    F: 'text-status-bad border-status-bad shadow-[0_0_40px_rgba(255,59,92,0.3)]',
  };

  const mockNeighbors = [
    { id: 'c1', name: 'Sarvagnanagar', grade: 'B', score: 74 },
    { id: 'c2', name: 'Jayanagar', grade: 'A', score: 82 },
    { id: 'c3', name: 'C.V. Raman Nagar', grade: 'C', score: 58 },
    { id: 'c4', name: 'Shanti Nagar', grade: 'B', score: 68 },
  ];

  return (
    <div className="page-enter mx-auto max-w-6xl py-8 pb-32">
      <button onClick={() => navigate('/more')} className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
        <ChevronLeft size={16} /> Back to More
      </button>

      {/* Grade Hero */}
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
            Sarvagnanagar · {pincode}
          </p>
        </div>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className={cn(
            "h-48 w-48 rounded-full border-4 flex flex-col items-center justify-center bg-bg-void/50 backdrop-blur-2xl relative z-10 transition-all duration-1000",
            gradeColors[report?.grade || 'C']
          )}
        >
          <span className="text-8xl font-display font-bold leading-none">{report?.grade}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Overall Grade</span>
        </motion.div>
        
        <div className="w-full max-w-lg space-y-4 relative">
          <div className="flex justify-between items-end px-2">
            <div className="text-left">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Performance Score</div>
              <div className="text-2xl font-mono font-bold text-text-primary">{report?.overallScore}/100</div>
            </div>
            <Badge variant="default" className="bg-green-core/10 text-green-core border-green-core/20">
              Top 15% in Bengaluru
            </Badge>
          </div>
          <div className="h-3 w-full rounded-full bg-glass-1 overflow-hidden border border-glass-border relative p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${report?.overallScore}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-green-core rounded-full shadow-glow" 
            />
          </div>
        </div>

        <div className="flex gap-4 relative">
          <Button size="lg" className="gap-2 shadow-glow" onClick={handleShare}>
            <Share2 size={18} /> Share Results
          </Button>
          <Button variant="secondary" size="lg" className="gap-2" onClick={() => navigate('/map')}>
            <Search size={18} /> Compare Others
          </Button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 space-y-8 group">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-green-core/10 text-green-core group-hover:scale-110 transition-transform">
                <Building2 size={24} />
               </div>
               <h3 className="text-2xl font-display font-bold text-text-primary uppercase tracking-tight">Infrastructure</h3>
             </div>
             <div className="text-3xl font-display font-bold text-green-core">B+</div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-4xl font-bold font-mono text-text-primary">{report?.sections.infrastructure.completed}<span className="text-text-muted text-xl">/{report?.sections.infrastructure.promised}</span></p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Key Projects Completed</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-bold text-green-core">82%</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Efficiency</p>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-glass-1 overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '82%' }}
                className="h-full bg-green-core shadow-glow" 
               />
            </div>
          </div>
        </Card>

        <Card className="p-8 space-y-8 group">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="p-3 rounded-2xl bg-gold-core/10 text-gold-core group-hover:scale-110 transition-transform">
                <Users size={24} />
               </div>
               <h3 className="text-2xl font-display font-bold text-text-primary uppercase tracking-tight">Civic Engagement</h3>
             </div>
             {report?.sections.turnout.trend === 'improving' ? <TrendingUp size={24} className="text-green-core animate-bounce" /> : <TrendingDown size={24} className="text-status-bad" />}
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={report?.sections.turnout.history}>
                <defs>
                  <linearGradient id="colorTurnoutReport" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold-core)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--gold-core)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="election" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 13, 20, 0.9)', borderColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }} 
                  itemStyle={{ color: 'var(--gold-core)', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--gold-core)" fillOpacity={1} fill="url(#colorTurnoutReport)" strokeWidth={4} animationDuration={2000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="md:col-span-2 p-8">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-glass-2 text-text-muted">
                  <Newspaper size={24} />
                </div>
                <h3 className="text-2xl font-display font-bold text-text-primary uppercase tracking-tight">Development Newsfeed</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-core gap-2"
                onClick={() => alert('Full newsfeed coming soon. Showing latest verified updates for now.')}
              >
              View All <ChevronRight size={14} />
              </Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report?.sections.news.map((n: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-glass-1 border border-glass-border hover:bg-glass-2 hover:border-glass-border-bright transition-all group cursor-pointer">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <h4 className="font-bold text-text-primary leading-snug group-hover:text-green-core transition-colors">{n.headline}</h4>
                      <Badge className="bg-glass-2 border-glass-border shrink-0 text-[9px]">LATEST</Badge>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-text-muted uppercase tracking-widest">
                       <span>{n.source}</span>
                       <span>{n.date}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </Card>

        <div className="md:col-span-2">
           <CompareNeighbors currentId={constituencyId} neighbors={mockNeighbors} />
        </div>
      </div>

      <Card variant="green" className="mt-12 p-8 flex items-start gap-6">
        <div className="p-3 rounded-2xl bg-green-core/10 text-green-core">
          <Info size={24} />
        </div>
        <div className="space-y-2">
          <p className="text-lg text-text-primary font-bold">Grading Methodology</p>
          <p className="text-sm text-text-secondary leading-relaxed max-w-5xl">
            This grade is a weighted aggregate of project completion rates (40%), government scheme implementation (20%), voter turnout trends (15%), representative attendance (15%), and independent civic audit reports (10%). Data is updated every quarter.
          </p>
        </div>
      </Card>
    </div>
  );
}
