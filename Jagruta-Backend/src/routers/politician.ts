import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../db/prisma';
import { getMockPolitician, mockPoliticians } from '../services/politicianService';

function mapPolitician(p: any) {
  return {
    id: p.id,
    name: p.name,
    party: p.party,
    level: p.level,
    constituency: p.constituencyRef?.name || p.constituency || 'Unknown Constituency',

    score: p.score,
    attendance: p.attendance,
    yearsInOffice: p.yearsInOffice,
    criminalCases: p.criminalCases,

    imageUrl: p.imageUrl,
    lat: p.lat,
    lng: p.lng,

    criminalRecords: p.criminalRecords || [],
    assetHistory: p.assetHistory || [],
    questionsAsked: p.questionsAsked || [],

    aiSummary: p.aiSummary
  };
}

export const politicianRouter = router({
  getFullProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const politician = await prisma.politician.findUnique({
        where: { id: input.id },
        include: {
          constituencyRef: true
        }
      });

      if (!politician) {
        return getMockPolitician(input.id);
      }

      return mapPolitician(politician);
    }),

  getByLayer: publicProcedure
    .input(
      z.object({
        layer: z.string().optional()
      })
    )
    .query(async () => {
      const politicians = await prisma.politician.findMany({
        include: {
          constituencyRef: true
        }
      });

      if (politicians.length === 0) {
        return mockPoliticians.map((p) => ({
          ...p,
          photo: p.imageUrl,
          constituencyName: p.constituency
        }));
      }

      return politicians.map((p: { id: any; name: any; party: any; level: any; lat: any; lng: any; imageUrl: any; constituencyRef: { name: any; }; score: any; }) => ({
        id: p.id,
        name: p.name,
        party: p.party,
        level: p.level,
        lat: p.lat,
        lng: p.lng,
        imageUrl: p.imageUrl,
        photo: p.imageUrl,
        constituency: p.constituencyRef.name,
        constituencyName: p.constituencyRef.name,
        score: p.score
      }));
    })
});