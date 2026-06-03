import { Politician } from '../../types/politician';
import { Constituency } from '../../types/constituency';
import { ManifestoPromise } from '../../types/manifesto';
import { ElectionCalendarEntry } from '../../types/election';

export const mockPoliticians: Politician[] = [
  {
    id: 'p1',
    name: 'Tejasvi Surya',
    nameKn: 'ತೇಜಸ್ವಿ ಸೂರ್ಯ',
    party: 'BJP',
    level: 'MP',
    constituency: 'Bangalore South',
    pincodes: ['560001', '560004', '560011', '560041'],
    score: 82,
    attendance: 92,
    criminalCases: 0,
    assets: '₹13.4 Cr',
    education: 'LL.B',
    bio: 'Member of Parliament from Bangalore South.',
  },
  {
    id: 'p2',
    name: 'K. J. George',
    nameKn: 'ಕೆ. ಜೆ. ಜಾರ್ಜ್',
    party: 'INC',
    level: 'MLA',
    constituency: 'Sarvagnanagar',
    pincodes: ['560033', '560043', '560084'],
    score: 74,
    attendance: 85,
    criminalCases: 2,
    assets: '₹89.4 Cr',
    education: 'B.A',
  },
  {
    id: 'p3',
    name: 'Sowmya Reddy',
    nameKn: 'ಸೌಮ್ಯ ರೆಡ್ಡಿ',
    party: 'INC',
    level: 'MLA',
    constituency: 'Jayanagar',
    pincodes: ['560011', '560041'],
    score: 78,
    attendance: 88,
    criminalCases: 1,
    assets: '₹2.1 Cr',
    education: 'M.S. in Environmental Technology',
  },
  {
    id: 'p4',
    name: 'N. A. Haris',
    nameKn: 'ಎನ್. ಎ. ಹ್ಯಾರಿಸ್',
    party: 'INC',
    level: 'MLA',
    constituency: 'Shanti Nagar',
    pincodes: ['560025', '560027'],
    score: 65,
    attendance: 72,
    criminalCases: 3,
    assets: '₹190.2 Cr',
    education: 'B.A',
  },
  {
    id: 'p5',
    name: 'S. Suresh Kumar',
    nameKn: 'ಎಸ್. ಸುರೇಶ್ ಕುಮಾರ್',
    party: 'BJP',
    level: 'MLA',
    constituency: 'Rajajinagar',
    pincodes: ['560010'],
    score: 88,
    attendance: 95,
    criminalCases: 0,
    assets: '₹4.5 Cr',
    education: 'LL.B',
  }
];

export const mockConstituencies: Constituency[] = [
  { id: 'c1', name: 'Sarvagnanagar', nameKn: 'ಸರ್ವಜ್ಞನಗರ', type: 'assembly', pincodes: ['560033'], politicianId: 'p2' },
  { id: 'c2', name: 'Jayanagar', nameKn: 'ಜಯನಗರ', type: 'assembly', pincodes: ['560011'], politicianId: 'p3' },
  { id: 'c3', name: 'Bangalore South', nameKn: 'ಬೆಂಗಳೂರು ದಕ್ಷಿಣ', type: 'parliament', pincodes: ['560001', '560011'], politicianId: 'p1' },
];

export const mockPromises: ManifestoPromise[] = [
  { id: 'pr1', party: 'BJP', text: 'Completion of peripheral ring road.', category: 'Roads', status: 'in-progress' },
  { id: 'pr2', party: 'INC', text: 'Free 200 units of electricity for every household.', category: 'Water', status: 'fulfilled' },
  { id: 'pr3', party: 'BJP', text: 'Installation of 5000 new CCTV cameras.', category: 'Safety', status: 'fulfilled' },
  { id: 'pr4', party: 'INC', text: 'Setting up of 10 new government schools in East Bengaluru.', category: 'Education', status: 'not-started' },
];

export const mockCalendar: ElectionCalendarEntry[] = [
  { id: 'cal1', constituencyName: 'BBMP Ward Elections', type: 'ward', nominationDate: '2024-05-10', votingDate: '2024-06-15', resultsDate: '2024-06-18' },
];
