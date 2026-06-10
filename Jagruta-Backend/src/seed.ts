import { prisma } from './db/prisma';

const constituencies = [
  { id: 'c-basavanagudi', name: 'Basavanagudi', pincode: '560004', lat: 12.9422, lng: 77.5738, party: 'BJP' },
  { id: 'c-jayanagar', name: 'Jayanagar', pincode: '560011', lat: 12.925, lng: 77.5938, party: 'INC' },
  { id: 'c-btm', name: 'B.T.M Layout', pincode: '560076', lat: 12.9166, lng: 77.6101, party: 'BJP' },
  { id: 'c-rajajinagar', name: 'Rajajinagar', pincode: '560010', lat: 12.9915, lng: 77.5552, party: 'BJP' },
  { id: 'c-malleshwaram', name: 'Malleshwaram', pincode: '560003', lat: 13.0031, lng: 77.5643, party: 'BJP' },
  { id: 'c-hebbal', name: 'Hebbal', pincode: '560024', lat: 13.0358, lng: 77.597, party: 'INC' },
  { id: 'c-yelahanka', name: 'Yelahanka', pincode: '560064', lat: 13.1007, lng: 77.5963, party: 'BJP' },
  { id: 'c-mahadevapura', name: 'Mahadevapura', pincode: '560048', lat: 12.991, lng: 77.6874, party: 'BJP' },
  { id: 'c-cvraman', name: 'C.V. Raman Nagar', pincode: '560093', lat: 12.9855, lng: 77.6649, party: 'INC' },
  { id: 'c-shivajinagar', name: 'Shivajinagar', pincode: '560051', lat: 12.9857, lng: 77.6057, party: 'INC' },
  { id: 'c-shantinagar', name: 'Shanti Nagar', pincode: '560027', lat: 12.9576, lng: 77.6025, party: 'INC' },
  { id: 'c-chickpet', name: 'Chickpet', pincode: '560053', lat: 12.97, lng: 77.576, party: 'BJP' },
  { id: 'c-gandhinagar', name: 'Gandhi Nagar', pincode: '560009', lat: 12.9784, lng: 77.5787, party: 'INC' },
  { id: 'c-vijayanagar', name: 'Vijayanagar', pincode: '560040', lat: 12.9719, lng: 77.5319, party: 'BJP' },
  { id: 'c-govindarajanagar', name: 'Govindaraj Nagar', pincode: '560079', lat: 12.9866, lng: 77.5369, party: 'BJP' },
  { id: 'c-padmanabhanagar', name: 'Padmanabhanagar', pincode: '560070', lat: 12.9181, lng: 77.5577, party: 'BJP' },
  { id: 'c-bommanahalli', name: 'Bommanahalli', pincode: '560068', lat: 12.9008, lng: 77.6238, party: 'BJP' },
  { id: 'c-krpuram', name: 'K.R. Puram', pincode: '560036', lat: 13.0076, lng: 77.6954, party: 'INC' },
  { id: 'c-pulakeshinagar', name: 'Pulakeshinagar', pincode: '560005', lat: 12.9987, lng: 77.6137, party: 'INC' },
  { id: 'c-byatarayanapura', name: 'Byatarayanapura', pincode: '560092', lat: 13.0659, lng: 77.5922, party: 'BJP' }
];

function getGrade(score: number) {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function buildReportSections(index: number) {
  return {
    infrastructure: {
      promised: 10 + (index % 5),
      completed: 6 + (index % 4),
      topProjects: [
        {
          name: 'Road repair and pothole filling',
          status: 'Completed'
        },
        {
          name: 'Streetlight maintenance',
          status: 'In Progress'
        },
        {
          name: 'Drainage improvement work',
          status: 'Planned'
        }
      ]
    },
    schemes: {
      implemented: 5 + (index % 4),
      total: 10,
      chips: ['Roads', 'Water Supply', 'Public Safety', 'Drainage']
    },
    turnout: {
      history: [
        {
          election: '2018 Assembly',
          value: 61 + (index % 6)
        },
        {
          election: '2023 Assembly',
          value: 65 + (index % 7)
        }
      ],
      trend: index % 2 === 0 ? 'improving' : 'declining'
    },
    attendance: 70 + (index % 20),
    news: [
      {
        title: 'Local civic development work reviewed',
        source: 'JAGRUTA Civic Desk',
        date: '2026-05-10'
      },
      {
        title: 'Public grievance meeting conducted',
        source: 'JAGRUTA Civic Desk',
        date: '2026-05-18'
      }
    ]
  };
}

const manifestoData = [
  {
    id: 'm1',
    party: 'BJP',
    category: 'Roads',
    title: 'Road Improvement Program',
    description: 'Upgrade major road stretches and reduce pothole complaints.',
    status: 'fulfilled',
    progress: 90,
    evidence: 'Road repair works completed in selected wards.'
  },
  {
    id: 'm2',
    party: 'INC',
    category: 'Water',
    title: 'Water Supply Improvement',
    description: 'Improve water supply reliability in dense residential areas.',
    status: 'in-progress',
    progress: 65,
    evidence: 'Pipeline upgrade work is under progress.'
  },
  {
    id: 'm3',
    party: 'JD(S)',
    category: 'Employment',
    title: 'Skill Development Camps',
    description: 'Organize local skill development camps and job fairs.',
    status: 'not-started',
    progress: 15,
    evidence: 'Planning stage information available.'
  },
  {
    id: 'm4',
    party: 'BJP',
    category: 'Education',
    title: 'Government School Upgrade',
    description: 'Improve classrooms, sanitation, and digital learning access.',
    status: 'in-progress',
    progress: 58,
    evidence: 'School improvement work is partially completed.'
  },
  {
    id: 'm5',
    party: 'INC',
    category: 'Healthcare',
    title: 'Ward Clinic Strengthening',
    description: 'Strengthen ward-level clinics and public health outreach.',
    status: 'fulfilled',
    progress: 82,
    evidence: 'Public health outreach activities conducted.'
  },
  {
    id: 'm6',
    party: 'IND',
    category: 'Safety',
    title: 'Streetlight and CCTV Coverage',
    description: 'Improve street lighting and CCTV coverage in high-risk areas.',
    status: 'broken',
    progress: 30,
    evidence: 'Limited implementation reported.'
  }
];

async function main() {
  console.log('Starting JAGRUTA seed...');

  for (let i = 0; i < constituencies.length; i++) {
    const c = constituencies[i];

    const score = 70 + (i % 20);
    const attendance = 65 + (i % 30);
    const criminalCases = i % 4;

    const constituency = await prisma.constituency.upsert({
      where: { pincode: c.pincode },
      update: {
        name: c.name,
        district: 'Bengaluru Urban',
        state: 'Karnataka'
      },
      create: {
        id: c.id,
        name: c.name,
        pincode: c.pincode,
        district: 'Bengaluru Urban',
        state: 'Karnataka'
      }
    });

    await prisma.politician.upsert({
      where: { id: `p${i + 1}` },
      update: {
        name: `${c.name} Representative`,
        party: c.party,
        level: 'MLA',
        constituencyId: constituency.id,
        score,
        attendance,
        yearsInOffice: 1 + (i % 12),
        criminalCases,
        imageUrl: '',
        lat: c.lat,
        lng: c.lng,
        criminalRecords:
          criminalCases === 0
            ? []
            : [
                {
                  type: 'Election affidavit case',
                  court: 'Local Court',
                  status: 'Pending'
                }
              ],
        assetHistory: [
          { year: 2018, value: 10000000 + i * 500000 },
          { year: 2023, value: 15000000 + i * 700000 }
        ],
        questionsAsked: [
          { topic: 'Infrastructure' },
          { topic: 'Water Supply' },
          { topic: 'Public Transport' }
        ],
        aiSummary: `${c.name} Representative represents ${c.name} as an MLA with a civic score of ${score}, attendance of ${attendance}%, and ${criminalCases} recorded criminal case(s).`
      },
      create: {
        id: `p${i + 1}`,
        name: `${c.name} Representative`,
        party: c.party,
        level: 'MLA',
        constituencyId: constituency.id,
        score,
        attendance,
        yearsInOffice: 1 + (i % 12),
        criminalCases,
        imageUrl: '',
        lat: c.lat,
        lng: c.lng,
        criminalRecords:
          criminalCases === 0
            ? []
            : [
                {
                  type: 'Election affidavit case',
                  court: 'Local Court',
                  status: 'Pending'
                }
              ],
        assetHistory: [
          { year: 2018, value: 10000000 + i * 500000 },
          { year: 2023, value: 15000000 + i * 700000 }
        ],
        questionsAsked: [
          { topic: 'Infrastructure' },
          { topic: 'Water Supply' },
          { topic: 'Public Transport' }
        ],
        aiSummary: `${c.name} Representative represents ${c.name} as an MLA with a civic score of ${score}, attendance of ${attendance}%, and ${criminalCases} recorded criminal case(s).`
      }
    });

    await prisma.reportCard.upsert({
      where: {
        constituencyId: constituency.id
      },
      update: {
        grade: getGrade(score),
        overallScore: score,
        sections: buildReportSections(i)
      },
      create: {
        constituencyId: constituency.id,
        grade: getGrade(score),
        overallScore: score,
        sections: buildReportSections(i)
      }
    });
  }

  for (const manifesto of manifestoData) {
    await prisma.manifesto.upsert({
      where: {
        id: manifesto.id
      },
      update: manifesto,
      create: manifesto
    });
  }

  console.log('Seed completed successfully.');
  console.log(`Constituencies seeded: ${constituencies.length}`);
  console.log(`Politicians seeded: ${constituencies.length}`);
  console.log(`Report cards seeded: ${constituencies.length}`);
  console.log(`Manifestos seeded: ${manifestoData.length}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });