export const mockPoliticians = [
  {
    id: 'p1',
    name: 'Basavanagudi Representative',
    nameKn: 'ಬಸವನಗುಡಿ ಪ್ರತಿನಿಧಿ',
    party: 'BJP',
    level: 'MLA',
    constituency: 'Basavanagudi',
    pincodes: ['560004'],
    score: 82,
    attendance: 91,
    yearsInOffice: 8,
    criminalCases: 1,
    assets: '₹1.8 Cr',
    education: 'Graduate',
    imageUrl: '',
    lat: 12.9422,
    lng: 77.5738,
    criminalRecords: [
      {
        type: 'Minor public order case',
        court: 'Local Court',
        status: 'Pending'
      }
    ],
    assetHistory: [
      { year: 2018, value: 12000000 },
      { year: 2023, value: 18000000 }
    ],
    questionsAsked: [
      { topic: 'Water Scarcity' },
      { topic: 'Public Transport' }
    ],
    billsVoted: [
      {
        title: 'Karnataka Urban Development Bill',
        session: 'Winter 2023',
        vote: 'YES'
      }
    ],
    promises: []
  },
  {
    id: 'p2',
    name: 'Jayanagar Representative',
    nameKn: 'ಜಯನಗರ ಪ್ರತಿನಿಧಿ',
    party: 'INC',
    level: 'MLA',
    constituency: 'Jayanagar',
    pincodes: ['560011'],
    score: 74,
    attendance: 84,
    yearsInOffice: 5,
    criminalCases: 3,
    assets: '₹2.1 Cr',
    education: 'Post Graduate',
    imageUrl: '',
    lat: 12.925,
    lng: 77.5938,
    criminalRecords: [
      {
        type: 'Election affidavit case',
        court: 'Sessions Court',
        status: 'Pending'
      }
    ],
    assetHistory: [
      { year: 2018, value: 9000000 },
      { year: 2023, value: 21000000 }
    ],
    questionsAsked: [
      { topic: 'Employment' },
      { topic: 'Education' }
    ],
    billsVoted: [
      {
        title: 'BBMP Ward Governance Bill',
        session: 'Monsoon 2023',
        vote: 'NO'
      }
    ],
    promises: []
  },
  {
    id: 'p3',
    name: 'B.T.M Layout Representative',
    nameKn: 'ಬಿ.ಟಿ.ಎಂ ಪ್ರತಿನಿಧಿ',
    party: 'JD(S)',
    level: 'MLA',
    constituency: 'B.T.M Layout',
    pincodes: ['560076'],
    score: 68,
    attendance: 76,
    yearsInOffice: 12,
    criminalCases: 0,
    assets: '₹1.9 Cr',
    education: 'Graduate',
    imageUrl: '',
    lat: 12.9166,
    lng: 77.6101,
    criminalRecords: [],
    assetHistory: [
      { year: 2018, value: 15000000 },
      { year: 2023, value: 19000000 }
    ],
    questionsAsked: [
      { topic: 'Healthcare' },
      { topic: 'Infrastructure' }
    ],
    billsVoted: [
      {
        title: 'Karnataka Public Health Bill',
        session: 'Budget 2023',
        vote: 'YES'
      }
    ],
    promises: []
  }
];

export function getMockPolitician(id: string) {
  return mockPoliticians.find((p) => p.id === id) || null;
}

export function mockReportCard(id: string) {
  return {
    constituencyId: id,
    grade: 'B',
    overallScore: 74,
    sections: {
      infrastructure: {
        completed: 18,
        promised: 24,
        topProjects: [
          {
            name: 'Road repair project',
            status: 'completed'
          },
          {
            name: 'Drainage upgrade',
            status: 'in-progress'
          }
        ]
      },
      schemes: {
        implemented: 12,
        total: 18,
        chips: ['Water', 'Roads', 'Waste Management']
      },
      turnout: {
        trend: 'improving',
        history: [
          { election: '2014', value: 58 },
          { election: '2018', value: 63 },
          { election: '2023', value: 68 }
        ]
      },
      attendance: 82,
      news: [
        {
          headline: 'New road improvement project approved',
          source: 'BBMP',
          date: '2026-03-14'
        },
        {
          headline: 'Water supply upgrade announced for ward areas',
          source: 'Local Civic Desk',
          date: '2026-02-28'
        }
      ]
    }
  };
}