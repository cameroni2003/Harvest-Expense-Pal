import {router} from '../trpc';
import {authRouter} from './auth';
import {exampleRouter} from './example';
import {harvestRouter} from './harvest';

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  harvest: harvestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
