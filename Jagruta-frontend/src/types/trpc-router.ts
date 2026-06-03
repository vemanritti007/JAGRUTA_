import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { Politician } from './politician';
import { Constituency, ReportCard } from './constituency';
import { ElectionResult, ElectionCalendarEntry } from './election';
import { ManifestoPromise } from './manifesto';

const t = initTRPC.create();

export const appRouter = t.router({
  'constituency.getByPincode': t.procedure
    .input(z.object({ pincode: z.string() }))
    .query((): {
        pincode: string;
        ward: Constituency;
        assembly: Constituency;
        parliament: Constituency;
        representatives: Politician[];
    } => { return {} as any; }),
  'politician.getByLayer': t.procedure
    .input(z.object({ layer: z.enum(['ward', 'assembly', 'parliament']) }))
    .query((): Array<{
        id: string;
        name: string;
        photo?: string;
        party: string;
        score: number;
        constituencyId: string;
        lat: number;
        lng: number;
    }> => { return [] as any; }),
  'politician.getFullProfile': t.procedure
    .input(z.object({ id: z.string() }))
    .query((): Politician & {
        criminalRecords: any[];
        assetHistory: any[];
        attendanceStats: any;
        questionsAsked: any[];
        billsVoted: any[];
        promises: ManifestoPromise[];
    } => { return {} as any; }),
  'politician.search': t.procedure
    .input(z.object({ query: z.string() }))
    .query((): Politician[] => { return [] as any; }),
  'election.getResults': t.procedure
    .input(z.object({ constituencyId: z.string().optional(), years: z.array(z.number()).optional(), type: z.string().optional() }))
    .query((): ElectionResult[] => { return [] as any; }),
  'manifesto.getPromises': t.procedure
    .input(z.object({ parties: z.array(z.string()).optional(), categories: z.array(z.string()).optional(), sort: z.string().optional() }))
    .query((): ManifestoPromise[] => { return [] as any; }),
  'elections.getCalendar': t.procedure
    .query((): ElectionCalendarEntry[] => { return [] as any; }),
  'constituency.getReportCard': t.procedure
    .input(z.object({ id: z.string() }))
    .query((): ReportCard => { return {} as any; })
});

export type AppRouter = typeof appRouter;
