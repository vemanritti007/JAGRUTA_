import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../db/prisma';
import { mockManifestos } from '../services/constituencyService';

export const manifestoRouter = router({
  getPromises: publicProcedure
    .input(
      z.object({
        parties: z.array(z.string()).optional(),
        categories: z.array(z.string()).optional()
      })
    )
    .query(async ({ input }) => {
      const promises = await prisma.manifesto.findMany({
        where: {
          party: input.parties && input.parties.length > 0 ? { in: input.parties } : undefined,
          category:
            input.categories && input.categories.length > 0
              ? { in: input.categories }
              : undefined
        }
      });

      if (promises.length === 0) {
        return mockManifestos.filter((p) => {
          const partyOk = !input.parties?.length || input.parties.includes(p.party);
          const categoryOk = !input.categories?.length || input.categories.includes(p.category);
          return partyOk && categoryOk;
        });
      }

      return promises;
    })
});