import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { generatePoliticianSummary } from '../services/aiservice';

export const aiRouter = router({
  getSummary: publicProcedure
    .input(z.object({ politicianId: z.string() }))
    .query(async ({ input }) => {
      const summary = await generatePoliticianSummary(input.politicianId);
      return {
        summary
      };
    })
});