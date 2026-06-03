import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../db/prisma';
import { mockPoliticians, mockReportCard } from '../services/politicianService';

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
    questionsAsked: p.questionsAsked || []
  };
}

export const constituencyRouter = router({
  getByPincode: publicProcedure
    .input(z.object({ pincode: z.string() }))
    .query(async ({ input }) => {
      const constituency = await prisma.constituency.findUnique({
        where: {
          pincode: input.pincode
        },
        include: {
          politicians: true
        }
      });

      if (!constituency) {
        return {
          id: 'c1',
          name: 'Sarvagnanagar',
          constituencyName: 'Sarvagnanagar',
          pincode: input.pincode,
          representatives: mockPoliticians
        };
      }

      return {
        id: constituency.id,
        name: constituency.name,
        constituencyName: constituency.name,
        pincode: constituency.pincode,
        representatives: constituency.politicians.map((p: any) =>
          mapPolitician({
            ...p,
            constituencyRef: constituency
          })
        )
      };
    }),

  getReportCard: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const report = await prisma.reportCard.findFirst({
        where: {
          constituencyId: input.id
        },
        include: {
          constituency: true
        }
      });

      if (!report) {
        return mockReportCard(input.id);
      }

      return {
        id: report.constituencyId,
        name: report.constituency.name,
        grade: report.grade,
        overallScore: report.overallScore,
        sections: report.sections
      };
    })
});