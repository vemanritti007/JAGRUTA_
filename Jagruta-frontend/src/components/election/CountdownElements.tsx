import * as React from 'react';
import {
  differenceInSeconds,
  intervalToDuration,
  type Duration,
  format,
  isValid,
} from 'date-fns';
import {
  Calendar as CalendarIcon,
  MapPin,
  Vote,
  Trophy,
  ClipboardList,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../ui/Card';

interface CountdownTimerProps {
  targetDate: string | Date | null | undefined;
}

function getSafeDate(value: string | Date | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  if (!isValid(date)) {
    return null;
  }

  return date;
}

function formatSafeDate(
  value: string | Date | null | undefined,
  fallback = 'Date not available'
) {
  const date = getSafeDate(value);

  if (!date) {
    return fallback;
  }

  return format(date, 'd MMM yyyy');
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = React.useState<Duration | null>(null);
  const [dateStatus, setDateStatus] = React.useState<
    'invalid' | 'past' | 'future'
  >('invalid');

  React.useEffect(() => {
    const target = getSafeDate(targetDate);

    if (!target) {
      setTimeLeft(null);
      setDateStatus('invalid');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const diff = differenceInSeconds(target, now);

      if (diff <= 0) {
        setTimeLeft(null);
        setDateStatus('past');
        return;
      }

      setTimeLeft(intervalToDuration({ start: now, end: target }));
      setDateStatus('future');
    };

    updateTimer();

    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n: number | undefined) => String(n || 0).padStart(2, '0');

  if (dateStatus === 'invalid') {
    return (
      <div className="text-text-muted font-mono text-2xl">
        Date not available
      </div>
    );
  }

  if (dateStatus === 'past') {
    return (
      <div className="text-status-good font-mono text-3xl">
        Event date passed
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="text-status-good font-mono text-3xl">
        Event date passed
      </div>
    );
  }

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

          <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export const ElectionEventCard = ({
  event,
  variant,
}: {
  event: any;
  variant?: string;
}) => {
  const votingDate = event?.votingDate || event?.date;
  const resultDate = event?.resultsDate || event?.resultDate;
  const nominationDate = event?.nominationDate;

  const hasNominationDate = Boolean(getSafeDate(nominationDate));
  const hasResultDate = Boolean(getSafeDate(resultDate));

  return (
    <Card
      className={`p-6 space-y-6 ${
        variant === 'horizontal'
          ? 'md:flex md:flex-row md:items-start md:gap-8'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex items-center rounded-full border border-glass-border bg-glass-1 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-core">
          {event?.type || 'event'}
        </div>

        <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted flex items-center gap-1 text-right">
          <MapPin size={10} /> {event?.constituencyName || 'Bengaluru'}
        </div>
      </div>

      <div className="flex-1 space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-display font-bold text-text-primary leading-tight">
            {event?.title || `${event?.type || 'Election'} Event`}
          </h3>

          {event?.description && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {hasNominationDate && (
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-bg-inset flex items-center justify-center text-text-muted">
              <ClipboardList size={20} />
            </div>

            <div className="flex-1 border-b border-border-subtle pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Nomination Date
              </p>

              <p className="font-medium">{formatSafeDate(nominationDate)}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-accent-green-subtle text-accent-green flex items-center justify-center">
            <Vote size={20} />
          </div>

          <div className="flex-1 border-b border-border-subtle pb-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-accent-green">
              Event Date
            </p>

            <p className="text-lg font-bold">{formatSafeDate(votingDate)}</p>
          </div>
        </div>

        {hasResultDate && (
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-bg-inset flex items-center justify-center text-text-muted">
              <Trophy size={20} />
            </div>

            <div className="flex-1 border-b border-border-subtle pb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                Results Declaration
              </p>

              <p className="font-medium">{formatSafeDate(resultDate)}</p>
            </div>
          </div>
        )}

        {event?.source && (
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-muted font-bold">
            <CalendarIcon size={12} />
            <span>Source: {event.source}</span>
            <ExternalLink size={12} />
          </div>
        )}
      </div>
    </Card>
  );
};