export type Party = 'BJP' | 'INC' | 'JD(S)' | 'IND';

export type PoliticianLevel = 'WARD CORPORATOR' | 'MLA' | 'MP';

export interface Politician {
  id: string;
  name: string;
  nameKn: string;
  party: Party;
  level: PoliticianLevel;
  constituency: string;
  pincodes: string[];
  imageUrl?: string;
  score: number; // 0-100
  attendance?: number;
  criminalCases?: number;
  assets?: string;
  education?: string;
  bio?: string;
  bioKn?: string;
}
