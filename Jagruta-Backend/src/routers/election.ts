import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { mockElectionResults } from '../services/constituencyService';

export const electionRouter = router({
  getResults: publicProcedure
    .input(
      z.object({
        years: z.array(z.number()),
        constituencyId: z.string()
      })
    )
    .query(async ({ input }) => {
      return mockElectionResults.filter((r) => input.years.includes(r.year));
    })
});