import { Party } from './politician';

export interface Election {
  id: string;
  year: number;
  type: 'ward' | 'assembly' | 'parliament';
  constituencyId?: string;
  constituencyName: string;
}

export interface Candidate {
  id: string;
  name: string;
  nameKn: string;
  party: Party | string;

  votes: number;
  votePercentage: number;
  status: 'WINNER' | 'RUNNER-UP' | 'LOST';

  criminalCases?: number;
  seriousCriminalCases?: number;
  assets?: string | null;
  liabilities?: string | null;
  education?: string | null;
  age?: number | null;
  profession?: string | null;
  affidavitUrl?: string | null;
  sourceUrl?: string | null;
}

export interface ElectionResult {
  electionId: string;
  year?: number;
  type?: string;
  state?: string;
  constituencyNo?: number | null;
  constituencyName: string;
  district?: string | null;

  winnerId: string;
  candidates: Candidate[];

  turnout: number;
  turnoutTrend?: number;

  sourceUrl?: string | null;
  sourceName?: string | null;
}

export interface ElectionCalendarEntry {
  id: string;
  constituencyName: string;
  type: 'ward' | 'assembly' | 'parliament';
  nominationDate: string;
  votingDate: string;
  resultsDate: string;
}