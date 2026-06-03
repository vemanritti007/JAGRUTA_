import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { CountdownTimer, ElectionEventCard } from '../components/election/CountdownElements';
import { Skeleton } from '../components/ui/Skeleton';
import { Calendar as CalendarIcon, List, Grid, Filter, Bell, MapPin, Search, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

export default function CalendarPage() {
  const navigate = useNavigate();
  const { data: calendar, isLoading } = (trpc as any)['elections.getCalendar'].useQuery();
  const [filter, setFilter] = React.useState('all');
  const [view, setView] = React.useState<'list' | 'grid'>('list');

  const filteredEvents = React.useMemo(() => {
    return calendar?.filter((e: any) => filter === 'all' || e.type === filter) || [];
  }, [calendar, filter]);

  const groupedEvents = React.useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredEvents.forEach((event: any) => {
      const month = format(parseISO(event.votingDate), 'MMMM yyyy');
      if (!groups[month]) groups[month] = [];
      groups[month].push(event);
    });
    return groups;
  }, [filteredEvents]);
const nextElection = calendar?.[0];
const handleSetReminder = () => {
  alert('Reminder saved for demo. In production this will connect to calendar notifications.');
};

const handleAddToCalendar = () => {
  if (!nextElection) return;

  const title = encodeURIComponent(`Election: ${nextElection.constituencyName}`);
  const details = encodeURIComponent('Election date added from JAGRUTA.');
  const date = nextElection.votingDate.replaceAll('-', '');

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${date}/${date}&details=${details}`;

  window.open(url, '_blank');
};

  if (isLoading) {
    return (
      <div className="page-enter mx-auto max-w-6xl space-y-12 py-8">
        <div className="skeleton h-[400px] rounded-3xl" />
        <div className="skeleton h-16 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-48 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  

  return (
    <div className="page-enter mx-auto max-w-6xl space-y-16 py-8 pb-32">
      <button onClick={() => navigate('/more')} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors -mb-8">
        <ChevronLeft size={16} /> Back to More
      </button>

      {/* Hero Countdown */}
      {nextElection && (
        <section className="glass-elevated p-12 relative overflow-hidden group flex flex-col items-center text-center space-y-10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-core via-transparent to-green-core opacity-50" />
          
          <div className="space-y-4 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-core/10 border border-green-core/20 text-green-core text-[10px] font-bold uppercase tracking-widest">
              <Bell size={12} className="animate-bounce" /> Voting Countdown Active
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-text-primary tracking-tight leading-tight">
              {nextElection.constituencyName}
            </h1>
            <p className="text-xl text-text-secondary font-body uppercase tracking-[0.2em]">
              Scheduled for {format(parseISO(nextElection.votingDate), 'MMMM d, yyyy')}
            </p>
          </div>

          <CountdownTimer targetDate={nextElection.votingDate} />

          <div className="flex gap-4 relative">
            <Button size="lg" className="gap-2 shadow-glow" onClick={handleSetReminder}>
              Set Reminder <Bell size={18} />
            </Button>

            <Button variant="secondary" size="lg" className="gap-2" onClick={handleAddToCalendar}>
              Add to Calendar <CalendarIcon size={18} />
            </Button>
          </div>
        </section>
      )}

      {/* Filter & View Bar */}
      <Card className="p-4 bg-bg-void/80 backdrop-blur-xl border-glass-border sticky top-[76px] z-40 rounded-2xl shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4 w-full">
          <div className="flex items-center gap-3 md:gap-4 w-full lg:w-auto min-w-0">
            <div className="flex items-center gap-2 text-text-muted border-r border-glass-border pr-3 md:pr-6 shrink-0">
              <Filter size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Election Type</span>
            </div>
            <div className="flex overflow-x-auto no-scrollbar gap-2 w-full pb-2 -mb-2 pr-4 -mr-4">
              {['all', 'ward', 'assembly', 'parliament'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border",
                    filter === t 
                      ? "bg-green-core text-bg-void border-green-core shadow-glow" 
                      : "bg-glass-1 text-text-muted border-glass-border hover:text-text-primary"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex bg-glass-1 p-1.5 rounded-xl border border-glass-border">
              <button 
                onClick={() => setView('list')}
                className={cn(
                  "p-2 rounded-lg transition-all", 
                  view === 'list' ? "bg-glass-2 text-green-core shadow-inner" : "text-text-muted hover:text-text-secondary"
                )}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setView('grid')}
                className={cn(
                  "p-2 rounded-lg transition-all", 
                  view === 'grid' ? "bg-glass-2 text-green-core shadow-inner" : "text-text-muted hover:text-text-secondary"
                )}
              >
                <Grid size={20} />
              </button>
            </div>
            <div className="w-px h-8 bg-glass-border hidden lg:block" />
            <Button variant="secondary" size="sm" className="gap-2">
              <MapPin size={14} /> My Area Only
            </Button>
          </div>
        </div>
      </Card>

      {/* Event List */}
      <div className="space-y-16">
        {Object.entries(groupedEvents).map(([month, events]) => (
          <div key={month} className="space-y-8">
            <div className="flex items-center gap-6 px-4">
               <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-muted whitespace-nowrap">{month}</h3>
               <div className="h-px w-full bg-gradient-to-r from-glass-border to-transparent" />
            </div>
            
            <div className={cn(
              "grid gap-8",
              view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {events.map(event => (
                <ElectionEventCard key={event.id} event={event} variant={view === 'list' ? 'horizontal' : 'vertical'} />
              ))}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 bg-glass-1 rounded-3xl border-2 border-dashed border-glass-border">
             <div className="p-6 rounded-full bg-glass-2 text-text-muted/30">
              <Search size={48} />
             </div>
             <div className="space-y-2">
              <h3 className="text-xl font-display font-bold text-text-muted">No scheduled elections</h3>
              <p className="text-sm text-text-muted/60 max-w-sm">There are no upcoming elections matching your current filters in our verified database.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
