import { Party } from './politician';

export interface Election {
  id: string;
  year: number;
  type: 'ward' | 'assembly' | 'parliament';
  constituencyId: string;
}

export interface Candidate {
  id: string;
  name: string;
  nameKn: string;
  party: Party;
  votes: number;
  votePercentage: number;
  status: 'WINNER' | 'RUNNER-UP' | 'LOST';
}

export interface ElectionResult {
  electionId: string;
  year?: number;
  constituencyName: string;
  winnerId: string;
  candidates: Candidate[];
  turnout: number;
  turnoutTrend?: number;
}

export interface ElectionCalendarEntry {
  id: string;
  constituencyName: string;
  type: 'ward' | 'assembly' | 'parliament';
  nominationDate: string;
  votingDate: string;
  resultsDate: string;
}