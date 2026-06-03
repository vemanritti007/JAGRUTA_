import * as React from 'react';
import { differenceInSeconds, intervalToDuration, type Duration } from 'date-fns';

interface CountdownTimerProps {
  targetDate: string;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = React.useState<Duration | null>(null);

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = differenceInSeconds(target, now);

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft(intervalToDuration({ start: now, end: target }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number | undefined) => String(n || 0).padStart(2, '0');

  if (!timeLeft) return <div className="text-status-good font-mono text-4xl">Election Underway</div>;

  return (
    <div className="flex gap-4 md:gap-8">
      {[
        { label: 'Days', value: timeLeft.days },
        { label: 'Hrs', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Sec', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <span className="text-4xl md:text-6xl font-bold font-mono tracking-tighter text-text-primary">
            {pad(item.value)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Calendar as CalendarIcon, MapPin, ClipboardList, Vote, Trophy } from 'lucide-react';
import { format } from 'date-fns';

export const ElectionEventCard = ({ event, variant }: { event: any, variant?: string }) => {
  return (
    <Card className={`p-6 space-y-6 ${variant === 'horizontal' ? 'flex flex-row' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge level={event.type.toUpperCase() as any} variant="level">{event.type}</Badge>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1">
          <MapPin size={10} /> {event.constituencyName}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-bg-inset flex items-center justify-center text-text-muted">
            <ClipboardList size={20} />
          </div>
          <div className="flex-1 border-b border-border-subtle pb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Nomination Ends</p>
            <p className="font-medium">{format(new Date(event.nominationDate), 'd MMM yyyy')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-accent-green-subtle text-accent-green flex items-center justify-center">
            <Vote size={20} />
          </div>
          <div className="flex-1 border-b border-border-subtle pb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-green">Voting Day</p>
            <p className="text-lg font-bold">{format(new Date(event.votingDate), 'd MMM yyyy')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-bg-inset flex items-center justify-center text-text-muted">
            <Trophy size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Results Declaration</p>
            <p className="font-medium">{format(new Date(event.resultsDate), 'd MMM yyyy')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
