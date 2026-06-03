import { router, publicProcedure } from '../trpc';
import { mockElectionCalendar } from '../services/constituencyService';

export const electionsRouter = router({
  getCalendar: publicProcedure.query(async () => {
    return mockElectionCalendar;
  })
});