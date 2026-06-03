export const mockManifestos = [
  {
    id: 'm1',
    party: 'BJP',
    category: 'Roads',
    text: 'Upgrade major road stretches and reduce pothole complaints.',
    status: 'fulfilled',
    evidence_url: 'https://example.com/roads'
  },
  {
    id: 'm2',
    party: 'INC',
    category: 'Water',
    text: 'Improve water supply reliability in dense residential wards.',
    status: 'in-progress',
    evidence_url: 'https://example.com/water'
  },
  {
    id: 'm3',
    party: 'JD(S)',
    category: 'Employment',
    text: 'Set up local skill development camps and job fairs.',
    status: 'not-started',
    evidence_url: 'https://example.com/employment'
  },
  {
    id: 'm4',
    party: 'BJP',
    category: 'Education',
    text: 'Improve classrooms, sanitation, and digital learning access in government schools.',
    status: 'in-progress',
    evidence_url: 'https://example.com/education'
  },
  {
    id: 'm5',
    party: 'INC',
    category: 'Healthcare',
    text: 'Strengthen ward-level clinics and public health outreach.',
    status: 'fulfilled',
    evidence_url: 'https://example.com/healthcare'
  },
  {
    id: 'm6',
    party: 'IND',
    category: 'Safety',
    text: 'Improve street lighting and CCTV coverage in high-risk areas.',
    status: 'broken',
    evidence_url: 'https://example.com/safety'
  }
];

export const mockElectionCalendar = [
  {
    id: 'ec1',
    constituencyName: 'Basavanagudi Assembly Constituency',
    type: 'assembly',
    nominationDate: '2026-04-20',
    votingDate: '2026-05-10',
    resultsDate: '2026-05-15'
  },
  {
    id: 'ec2',
    constituencyName: 'Bangalore Central Parliamentary Constituency',
    type: 'parliament',
    nominationDate: '2026-05-15',
    votingDate: '2026-06-04',
    resultsDate: '2026-06-10'
  },
  {
    id: 'ec3',
    constituencyName: 'Ward Committee Elections',
    type: 'ward',
    nominationDate: '2026-07-01',
    votingDate: '2026-07-20',
    resultsDate: '2026-07-25'
  }
];

export const mockElectionResults = [
  {
    electionId: 'r2014',
    year: 2014,
    constituencyName: 'Sarvagnanagar Assembly Constituency',
    winnerId: 'p2',
    turnout: 59.8,
    turnoutTrend: -2.1,
    candidates: [
      {
        id: 'p2',
        name: 'Ramesh Gowda',
        nameKn: 'ರಮೇಶ್ ಗೌಡ',
        party: 'INC',
        votes: 41000,
        votePercentage: 43,
        status: 'WINNER'
      },
      {
        id: 'p1',
        name: 'Suresh Kumar',
        nameKn: 'ಸುರೇಶ್ ಕುಮಾರ್',
        party: 'BJP',
        votes: 39000,
        votePercentage: 41,
        status: 'RUNNER-UP'
      },
      {
        id: 'p3',
        name: 'Manjunath Rao',
        nameKn: 'ಮಂಜುನಾಥ್ ರಾವ್',
        party: 'JD(S)',
        votes: 15000,
        votePercentage: 16,
        status: 'LOST'
      }
    ]
  },
  {
    electionId: 'r2018',
    year: 2018,
    constituencyName: 'Sarvagnanagar Assembly Constituency',
    winnerId: 'p1',
    turnout: 63.2,
    turnoutTrend: 3.4,
    candidates: [
      {
        id: 'p1',
        name: 'Suresh Kumar',
        nameKn: 'ಸುರೇಶ್ ಕುಮಾರ್',
        party: 'BJP',
        votes: 47000,
        votePercentage: 44,
        status: 'WINNER'
      },
      {
        id: 'p2',
        name: 'Ramesh Gowda',
        nameKn: 'ರಮೇಶ್ ಗೌಡ',
        party: 'INC',
        votes: 43000,
        votePercentage: 40,
        status: 'RUNNER-UP'
      },
      {
        id: 'p3',
        name: 'Manjunath Rao',
        nameKn: 'ಮಂಜುನಾಥ್ ರಾವ್',
        party: 'JD(S)',
        votes: 17000,
        votePercentage: 16,
        status: 'LOST'
      }
    ]
  },
  {
    electionId: 'r2019',
    year: 2019,
    constituencyName: 'Bangalore Central Parliamentary Constituency',
    winnerId: 'p4',
    turnout: 61.6,
    turnoutTrend: -1.6,
    candidates: [
      {
        id: 'p4',
        name: 'Arvind Shetty',
        nameKn: 'ಅರವಿಂದ್ ಶೆಟ್ಟಿ',
        party: 'BJP',
        votes: 52000,
        votePercentage: 48,
        status: 'WINNER'
      },
      {
        id: 'p2',
        name: 'Ramesh Gowda',
        nameKn: 'ರಮೇಶ್ ಗೌಡ',
        party: 'INC',
        votes: 45000,
        votePercentage: 42,
        status: 'RUNNER-UP'
      },
      {
        id: 'p3',
        name: 'Manjunath Rao',
        nameKn: 'ಮಂಜುನಾಥ್ ರಾವ್',
        party: 'JD(S)',
        votes: 11000,
        votePercentage: 10,
        status: 'LOST'
      }
    ]
  },
  {
    electionId: 'r2023',
    year: 2023,
    constituencyName: 'Sarvagnanagar Assembly Constituency',
    winnerId: 'p1',
    turnout: 68.4,
    turnoutTrend: 6.8,
    candidates: [
      {
        id: 'p1',
        name: 'Suresh Kumar',
        nameKn: 'ಸುರೇಶ್ ಕುಮಾರ್',
        party: 'BJP',
        votes: 52000,
        votePercentage: 46,
        status: 'WINNER'
      },
      {
        id: 'p2',
        name: 'Ramesh Gowda',
        nameKn: 'ರಮೇಶ್ ಗೌಡ',
        party: 'INC',
        votes: 48000,
        votePercentage: 42,
        status: 'RUNNER-UP'
      },
      {
        id: 'p3',
        name: 'Manjunath Rao',
        nameKn: 'ಮಂಜುನಾಥ್ ರಾವ್',
        party: 'JD(S)',
        votes: 13500,
        votePercentage: 12,
        status: 'LOST'
      }
    ]
  },
  {
    electionId: 'r2024',
    year: 2024,
    constituencyName: 'Bangalore Central Parliamentary Constituency',
    winnerId: 'p4',
    turnout: 66.1,
    turnoutTrend: -2.3,
    candidates: [
      {
        id: 'p4',
        name: 'Arvind Shetty',
        nameKn: 'ಅರವಿಂದ್ ಶೆಟ್ಟಿ',
        party: 'BJP',
        votes: 61000,
        votePercentage: 49,
        status: 'WINNER'
      },
      {
        id: 'p2',
        name: 'Ramesh Gowda',
        nameKn: 'ರಮೇಶ್ ಗೌಡ',
        party: 'INC',
        votes: 54000,
        votePercentage: 43,
        status: 'RUNNER-UP'
      },
      {
        id: 'p5',
        name: 'Naveen Reddy',
        nameKn: 'ನವೀನ್ ರೆಡ್ಡಿ',
        party: 'IND',
        votes: 10000,
        votePercentage: 8,
        status: 'LOST'
      }
    ]
  }
];