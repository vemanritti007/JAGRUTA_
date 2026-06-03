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
        layer: z.enum(['ward', 'assembly', 'parliament'])
      })
    )
    .query(async () => {
      const politicians = await prisma.politician.findMany({
        include: { constituencyRef: true }
      });

      if (politicians.length === 0) {
        return mockPoliticians.map((p: any) => ({
          id: p.id,
          name: p.name,
          photo: p.imageUrl || '',
          party: p.party,
          score: p.score,
          constituencyId: 'c1',
          constituencyName: p.constituency,
          lat: p.lat,
          lng: p.lng,
          level: p.level,
          criminal: {
            caseCount: p.criminalCases || 0
          }
        }));
      }

      return politicians.map((p: any) => ({
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
        criminal: {
          caseCount: p.criminalCases || 0
        }
      }));
    }),

  'politician.getFullProfile': publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const politician = await prisma.politician.findUnique({
        where: { id: input.id },
        include: { constituencyRef: true }
      });

      if (!politician) {
        const mock = mockPoliticians.find((p: any) => p.id === input.id);
        return mock ? mapPolitician(mock) : null;
      }

      return mapPolitician(politician);
    }),

  'politician.search': publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const politicians = await prisma.politician.findMany({
        where: {
          name: {
            contains: input.query,
            mode: 'insensitive'
          }
        },
        include: { constituencyRef: true }
      });

      return politicians.map((p: any) => mapPolitician(p));
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
    const years = input.years || [];

    let results = mockElectionResults;

    if (years.length > 0) {
      results = results.filter((result: any) => years.includes(result.year));
    }

    if (input.constituencyName) {
      results = results.filter((result: any) =>
        result.constituencyName
          .toLowerCase()
          .includes(input.constituencyName!.toLowerCase())
      );
    }

    return results.map((result: any) => ({
      electionId: result.electionId,
      year: result.year,
      constituencyName: result.constituencyName,
      winnerId: result.winnerId,
      turnout: result.turnout,
      turnoutTrend: result.turnoutTrend,
      candidates: result.candidates.map((candidate: any) => ({
        id: candidate.id,
        name: candidate.name,
        nameKn: candidate.nameKn || candidate.name,
        party: candidate.party,
        votes: candidate.votes,
        votePercentage: candidate.votePercentage,
        status: candidate.status
      }))
    }));
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
      const promises = await prisma.manifesto.findMany({
        where: {
          party:
            input.parties && input.parties.length > 0
              ? { in: input.parties }
              : undefined,
          category:
            input.categories && input.categories.length > 0
              ? { in: input.categories }
              : undefined
        }
      });

      const data = promises.length > 0 ? promises : mockManifestos;

      return data
        .filter((p: any) => {
          const partyOk = !input.parties?.length || input.parties.includes(p.party);
          const categoryOk =
            !input.categories?.length || input.categories.includes(p.category);
          return partyOk && categoryOk;
        })
        .map((p: any) => ({
          id: p.id,
          party: p.party,
          text: p.text || p.description || p.title,
          category: p.category,
          status: p.status,
          evidence_url: p.evidence_url || p.evidence || '',
          politicianId: p.politicianId
        }));
    }),

  'elections.getCalendar': publicProcedure.query(async () => {
    return mockElectionCalendar;
  }),

  'constituency.getReportCard': publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const report = await prisma.reportCard.findFirst({
        where: { constituencyId: input.id },
        include: { constituency: true }
      });

      if (!report) {
        return mockReportCard(input.id);
      }

      return {
        constituencyId: report.constituencyId,
        grade: report.grade,
        overallScore: report.overallScore,
        sections: report.sections
      };
    })
});

export type AppRouter = typeof appRouter;