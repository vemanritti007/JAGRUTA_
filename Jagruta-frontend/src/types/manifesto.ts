import { Party } from './politician';

export type PromiseStatus = 'fulfilled' | 'in-progress' | 'broken' | 'not-started';

export type PromiseCategory = 'Roads' | 'Water' | 'Employment' | 'Education' | 'Healthcare' | 'Safety';

export interface ManifestoPromise {
  id: string;
  party: Party;
  text: string;
  category: PromiseCategory;
  status: PromiseStatus;
  evidence_url?: string;
  politicianId?: string;
}

export interface PartyScore {
  party: Party;
  fulfillmentPercentage: number;
  counts: {
    fulfilled: number;
    inProgress: number;
    broken: number;
    notStarted: number;
  };
}
