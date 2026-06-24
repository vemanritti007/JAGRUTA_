import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../db/prisma';
import { mockPoliticians, mockReportCard } from '../services/politicianService';
import {
  mockManifestos,
  mockElectionCalendar,
  mockElectionResults
} from '../services/constituencyService';

function mapPolitician(p: any) {
  return {
    id: p.id,
    name: p.name,
    nameKn: p.nameKn || p.name,
    party: p.party,
    level: p.level,
    constituency: p.constituencyRef?.name || p.constituency || 'Unknown',
    pincodes: p.constituencyRef?.pincode ? [p.constituencyRef.pincode] : p.pincodes || [],

    imageUrl: p.imageUrl || '',
    score: p.score,
    attendance: p.attendance,
    yearsInOffice: p.yearsInOffice,
    criminalCases: p.criminalCases,
    assets: p.assets || '₹1.2 Cr',
    education: p.education || 'Graduate',
    bio:
      p.bio ||
      `${p.name} is a public representative from ${
        p.constituencyRef?.name || p.constituency || 'Bengaluru'
      }.`,
    bioKn: p.bioKn || '',

    criminalRecords: p.criminalRecords || [],
    assetHistory: p.assetHistory || [],
    attendanceStats: p.attendanceStats || {
      present: p.attendance || 0,
      average: 76
    },
    questionsAsked: p.questionsAsked || [],
    billsVoted: p.billsVoted || [],
    promises: p.promises || []
  };
}

export const appRouter = router({
  'constituency.getByPincode': publicProcedure
    .input(z.object({ pincode: z.string() }))
    .query(async ({ input }) => {
      const constituency = await prisma.constituency.findUnique({
        where: { pincode: input.pincode },
        include: { politicians: true }
      });

      if (!constituency) {
        return {
          pincode: input.pincode,
          ward: {
            id: 'ward-unknown',
            name: 'Unknown Ward',
            nameKn: '',
            type: 'ward' as const,
            pincodes: [input.pincode]
          },
          assembly: {
            id: 'c1',
            name: 'Sarvagnanagar',
            nameKn: 'ಸರ್ವಜ್ಞನಗರ',
            type: 'assembly' as const,
            pincodes: [input.pincode]
          },
          parliament: {
            id: 'pc1',
            name: 'Bangalore Central',
            nameKn: 'ಬೆಂಗಳೂರು ಸೆಂಟ್ರಲ್',
            type: 'parliament' as const,
            pincodes: [input.pincode]
          },
          representatives: mockPoliticians
        };
      }

      const representatives = constituency.politicians.map((p: any) =>
        mapPolitician({
          ...p,
          constituencyRef: constituency
        })
      );

      return {
        pincode: input.pincode,
        ward: {
          id: `${constituency.id}-ward`,
          name: `${constituency.name} Ward`,
          nameKn: '',
          type: 'ward' as const,
          pincodes: [constituency.pincode]
        },
        assembly: {
          id: constituency.id,
          name: constituency.name,
          nameKn: '',
          type: 'assembly' as const,
          pincodes: [constituency.pincode]
        },
        parliament: {
          id: `${constituency.id}-parliament`,
          name: 'Bangalore Central',
          nameKn: '',
          type: 'parliament' as const,
          pincodes: [constituency.pincode]
        },
        representatives
      };
    }),

 'politician.getByLayer': publicProcedure
  .input(
    z.object({
      layer: z.string().optional()
    }).optional()
  )
  .query(async () => {
    const politicians = await prisma.politician.findMany({
      include: {
        constituencyRef: true
      },
      orderBy: {
        constituencyRef: {
          name: 'asc'
        }
      }
    });

    return politicians.map((p) => ({
      id: p.id,
      name: p.name,
      photo: p.imageUrl || '',
      party: p.party,
      score: p.score,
      constituencyId: p.constituencyId,
      constituencyName: p.constituencyRef.name,
      lat: p.lat || 12.9716,
      lng: p.lng || 77.5946,
      level: p.level,

      attendance: p.attendance,
      electionVotes: p.electionVotes,
      votePercentage: p.votePercentage,
      education: p.education,
      age: p.age,
      profession: p.profession,

      criminal: {
        caseCount: p.criminalCases || 0
      }
    }));
  }),
  'politician.getFullProfile': publicProcedure
  .input(
    z.object({
      id: z.string()
    })
  )
  .query(async ({ input }) => {
    const politician = await prisma.politician.findUnique({
      where: {
        id: input.id
      },
      include: {
        constituencyRef: true
      }
    });

    if (!politician) {
      return null;
    }

    return {
      id: politician.id,
      name: politician.name,
      nameKn: politician.name,
      party: politician.party,
      partyFullName: politician.partyFullName,
      level: politician.level,
      constituency: politician.constituencyRef.name,
      pincodes: [politician.constituencyRef.pincode],

      imageUrl: politician.imageUrl || '',
      score: politician.score,
      attendance: politician.attendance,
      yearsInOffice: politician.yearsInOffice,
      criminalCases: politician.criminalCases,

      age: politician.age,
      education: politician.education,
      profession: politician.profession,
      professionDescription: politician.professionDescription,
      assets: politician.assets,
      liabilities: politician.liabilities,

      electionVotes: politician.electionVotes,
      votePercentage: politician.votePercentage,
      turnoutPercentage: politician.turnoutPercentage,
      validVotes: politician.validVotes,
      electors: politician.electors,

      sourceElection: politician.sourceElection,
      sourceAttendance: politician.sourceAttendance,
      sourceElectedMember: politician.sourceElectedMember,

      bio: `${politician.name} is the elected MLA from ${politician.constituencyRef.name}. The representative belongs to ${politician.party}.`,
      bioKn: '',

      criminalRecords: politician.criminalRecords || [],
      assetHistory: politician.assetHistory || [],
      questionsAsked: politician.questionsAsked || [],

      attendanceStats: {
        present: politician.attendance || 0,
        average: 76
      },

      billsVoted: [],
      promises: []
    };
  }),

  'politician.search': publicProcedure
  .input(
    z.object({
      query: z.string()
    })
  )
  .query(async ({ input }) => {
    const politicians = await prisma.politician.findMany({
      where: {
        OR: [
          {
            name: {
              contains: input.query,
              mode: 'insensitive'
            }
          },
          {
            party: {
              contains: input.query,
              mode: 'insensitive'
            }
          },
          {
            constituencyRef: {
              name: {
                contains: input.query,
                mode: 'insensitive'
              }
            }
          }
        ]
      },
      include: {
        constituencyRef: true
      },
      take: 20
    });

    return politicians.map((p) => ({
      id: p.id,
      name: p.name,
      nameKn: p.name,
      party: p.party,
      level: p.level,
      constituency: p.constituencyRef.name,
      pincodes: [p.constituencyRef.pincode],
      imageUrl: p.imageUrl || '',
      score: p.score,
      attendance: p.attendance,
      criminalCases: p.criminalCases
    }));
  }),

  'election.getResults': publicProcedure
  .input(
    z.object({
      constituencyId: z.string().optional(),
      constituencyName: z.string().optional(),
      years: z.array(z.number()).optional(),
      type: z.string().optional()
    })
  )
  .query(async ({ input }) => {
    const elections = await prisma.election.findMany({
      where: {
        year:
          input.years && input.years.length > 0
            ? { in: input.years }
            : undefined,
        type: input.type || undefined,
        constituencyName: input.constituencyName
          ? {
              contains: input.constituencyName,
              mode: 'insensitive'
            }
          : undefined
      },
      include: {
        candidates: {
          orderBy: {
            votes: 'desc'
          }
        },
        dataSource: true
      },
      orderBy: {
        constituencyName: 'asc'
      }
    });

    return elections.map((election) => {
      const winner =
        election.candidates.find((candidate) => candidate.status === 'WINNER') ||
        election.candidates[0];

      return {
        electionId: election.id,
        year: election.year,
        type: election.type,
        state: election.state,
        constituencyNo: election.constituencyNo,
        constituencyName: election.constituencyName,
        district: election.district,

        winnerId: winner?.id || '',
        turnout: election.turnout || 0,
        turnoutTrend: election.turnoutTrend || 0,

        sourceUrl: election.sourceUrl,
        sourceName: election.dataSource?.name || 'Verified election dataset',

        candidates: election.candidates.map((candidate, index) => ({
          id: candidate.id,
          name: candidate.candidateName,
          nameKn: candidate.candidateNameKn || candidate.candidateName,
          party: candidate.party,

          votes: candidate.votes,
          votePercentage: candidate.votePercentage,
          status:
            candidate.status ||
            (index === 0 ? 'WINNER' : index === 1 ? 'RUNNER-UP' : 'LOST'),

          criminalCases: candidate.criminalCases,
          seriousCriminalCases: candidate.seriousCriminalCases,
          assets: candidate.assets,
          liabilities: candidate.liabilities,
          education: candidate.education,
          age: candidate.age,
          profession: candidate.profession,

          affidavitUrl: candidate.affidavitUrl,
          sourceUrl: candidate.sourceUrl,
        }))
      };
    });
  }),
    'constituency.getReportCard': publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        constituencyName: z.string().optional(),
        pincode: z.string().optional()
      })
    )
    .query(async ({ input }) => {
      let constituency = null;

      if (input.id && input.id !== 'c1' && input.id !== 'demo') {
        constituency = await prisma.constituency.findUnique({
          where: {
            id: input.id
          },
          include: {
            politicians: true
          }
        });
      }

      if (!constituency && input.pincode) {
        constituency = await prisma.constituency.findUnique({
          where: {
            pincode: input.pincode
          },
          include: {
            politicians: true
          }
        });
      }

      if (!constituency && input.constituencyName) {
        constituency = await prisma.constituency.findFirst({
          where: {
            name: {
              contains: input.constituencyName,
              mode: 'insensitive'
            }
          },
          include: {
            politicians: true
          }
        });
      }

      if (!constituency) {
        constituency = await prisma.constituency.findFirst({
          include: {
            politicians: true
          },
          orderBy: {
            name: 'asc'
          }
        });
      }

      if (!constituency) {
        return {
          constituencyId: input.id || 'unknown',
          constituencyName: 'No constituency found',
          grade: 'N/A',
          overallScore: 0,
          sections: []
        };
      }

      const savedReport = await prisma.reportCard.findFirst({
        where: {
          constituencyId: constituency.id
        },
        include: {
          constituency: true
        }
      });

      if (savedReport) {
        return {
          constituencyId: savedReport.constituencyId,
          constituencyName: savedReport.constituency.name,
          grade: savedReport.grade,
          overallScore: savedReport.overallScore,
          sections: savedReport.sections
        };
      }

      const politician = constituency.politicians[0];

      const complaints = await prisma.civicComplaint.findMany({
        where: {
          ward: {
            assemblyConstituency: {
              contains: constituency.name,
              mode: 'insensitive'
            }
          }
        }
      });

      const fulfilledComplaints = complaints.filter((complaint) =>
        ['FULFILLED', 'RESOLVED', 'COMPLETED', 'CLOSED'].includes(
          String(complaint.status || '').toUpperCase()
        )
      ).length;

      const pendingComplaints = complaints.filter((complaint) =>
        ['PENDING', 'IGNORED', 'UNRESOLVED', 'REJECTED', 'OPEN'].includes(
          String(complaint.status || '').toUpperCase()
        )
      ).length;

      const complaintTotal = fulfilledComplaints + pendingComplaints;

      const complaintScore =
        complaintTotal > 0
          ? Math.round((fulfilledComplaints / complaintTotal) * 100)
          : 65;

      const attendanceScore = politician?.attendance
        ? Math.round(politician.attendance)
        : 70;

      const performanceScore = politician?.score
        ? Math.round(politician.score)
        : 70;

      const criminalScore =
        politician?.criminalCases && politician.criminalCases > 0
          ? Math.max(40, 100 - politician.criminalCases * 15)
          : 90;

      const overallScore = Math.round(
        attendanceScore * 0.25 +
          performanceScore * 0.35 +
          complaintScore * 0.25 +
          criminalScore * 0.15
      );

      const grade =
        overallScore >= 85
          ? 'A'
          : overallScore >= 70
            ? 'B'
            : overallScore >= 55
              ? 'C'
              : overallScore >= 40
                ? 'D'
                : 'F';

      return {
        constituencyId: constituency.id,
        constituencyName: constituency.name,
        grade,
        overallScore,
        sections: [
          {
            title: 'Representative Performance',
            score: performanceScore,
            status:
              performanceScore >= 75
                ? 'good'
                : performanceScore >= 60
                  ? 'average'
                  : 'poor',
            description: politician
              ? `${politician.name} has a performance score of ${performanceScore}/100.`
              : 'No representative data available.'
          },
          {
            title: 'Assembly Attendance',
            score: attendanceScore,
            status:
              attendanceScore >= 75
                ? 'good'
                : attendanceScore >= 60
                  ? 'average'
                  : 'poor',
            description: politician
              ? `Attendance is ${attendanceScore}%.`
              : 'Attendance data is not available.'
          },
          {
            title: 'Civic Complaint Resolution',
            score: complaintScore,
            status:
              complaintScore >= 70
                ? 'good'
                : complaintScore >= 50
                  ? 'average'
                  : 'poor',
            description: `${fulfilledComplaints} fulfilled complaints and ${pendingComplaints} pending/ignored complaints were found for this constituency.`
          },
          {
            title: 'Criminal Case Indicator',
            score: criminalScore,
            status:
              criminalScore >= 80
                ? 'good'
                : criminalScore >= 60
                  ? 'average'
                  : 'poor',
            description: politician
              ? `${politician.criminalCases || 0} declared criminal case(s) recorded.`
              : 'Criminal case data is not available.'
          }
        ]
      };
    }),
  'manifesto.getPromises': publicProcedure
  .input(
    z.object({
      parties: z.array(z.string()).optional(),
      categories: z.array(z.string()).optional(),
      sort: z.string().optional()
    })
  )
  .query(async ({ input }) => {
    const normalizeParty = (party: string) => {
      const value = party.trim().toUpperCase();

      if (value === 'JDS' || value === 'JD(S)' || value === 'JD S') return 'JD(S)';
      if (value === 'CONGRESS' || value === 'INC') return 'INC';
      if (value === 'BJP') return 'BJP';
      if (value === 'AAP') return 'AAP';

      return value;
    };

    const getEvidenceUrl = (evidence: string | null | undefined) => {
      if (!evidence) return '';

      const lower = evidence.toLowerCase();

      if (lower.startsWith('http://') || lower.startsWith('https://')) {
        return evidence;
      }

      let fileName = '';

      if (lower.includes('bjp')) fileName = 'bjp.pdf';
      else if (lower.includes('inc') || lower.includes('congress')) fileName = 'inc.pdf';
      else if (lower.includes('jds') || lower.includes('jd(s)')) fileName = 'jds.pdf';
      else if (lower.includes('aap')) fileName = 'aap.pdf';

      if (!fileName) return '';

      const pageMatch = lower.match(/page\s*(\d+)/);
      const page = pageMatch ? pageMatch[1] : '';

      return page
        ? `/evidence/${fileName}#page=${page}`
        : `/evidence/${fileName}`;
    };

    const selectedParties =
      input.parties && input.parties.length > 0
        ? input.parties.map(normalizeParty)
        : undefined;

    const promises = await prisma.manifesto.findMany({
      orderBy: {
        party: 'asc'
      }
    });

    const filtered = promises.filter((p) => {
      const party = normalizeParty(p.party);
      const category = p.category.trim();

      const partyOk =
        !selectedParties || selectedParties.includes(party);

      const categoryOk =
        !input.categories ||
        input.categories.length === 0 ||
        input.categories.includes(category);

      return partyOk && categoryOk;
    });

    return filtered.map((p) => {
      const party = normalizeParty(p.party);
      const evidenceUrl = getEvidenceUrl(p.evidence);

      return {
        id: p.id,
        party,
        text: p.description || p.title,
        title: p.title,
        description: p.description,
        category: p.category,
        status: p.status,
        progress: p.progress,
        evidence_url: evidenceUrl,
        evidence: p.evidence || 'Manifesto PDF',
        politicianId: ''
      };
    });
  }),

  'elections.getCalendar': publicProcedure.query(async () => {
  const events = await prisma.electionCalendar.findMany({
    orderBy: {
      votingDate: 'asc'
    }
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    type: event.type,
    constituencyName: event.constituencyName || 'Bengaluru',

    votingDate: event.votingDate.toISOString(),
    date: event.votingDate.toISOString(),

    description: event.description || '',
    source: event.source || ''
  }));
}),
});
export type AppRouter = typeof appRouter;