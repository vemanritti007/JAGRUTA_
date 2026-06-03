import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScoreColor(score: number) {
  if (score <= 40) return 'var(--status-bad)';
  if (score <= 70) return 'var(--status-warn)';
  return 'var(--status-good)';
}

export function getPartyColor(party: string) {
  const partyColors: Record<string, string> = {
    'BJP': 'var(--party-bjp)',
    'INC': 'var(--party-inc)',
    'JDS': 'var(--party-jds)',
    'JD(S)': 'var(--party-jds)',
    'AAP': 'var(--party-inc)', // Defaulting AAP to INC color or green if not defined
    'IND': 'var(--party-ind)',
    'Independent': 'var(--party-ind)',
  };
  return partyColors[party] || 'var(--party-ind)';
}
