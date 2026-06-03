import { Party, PoliticianLevel } from './politician';

export interface Constituency {
  id: string;
  name: string;
  nameKn: string;
  type: 'ward' | 'assembly' | 'parliament';
  pincodes: string[];
  politicianId?: string;
  geometry?: any;
}

export interface ReportCard {
  constituencyId: string;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  overallScore: number;
  sections: {
    infrastructure: { promised: number; completed: number; topProjects: any[] };
    schemes: { implemented: number; total: number; chips: string[] };
    turnout: { history: { election: string; value: number }[]; trend: 'improving' | 'declining' };
    attendance: number;
    news: any[];
  };
}
