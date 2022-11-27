import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"];
  }

  interface Profile {
    accounts?: object[]
  }

  interface JWTExt extends JWT {
    accounts?: HarvestAccount[]
    access_token?: string
  }

  interface HarvestAccount {
    id: number
    name: string
    product: string
  }
}
