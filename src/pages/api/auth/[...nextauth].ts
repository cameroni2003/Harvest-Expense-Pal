import NextAuth, { type NextAuthOptions } from "next-auth";
import { env } from "../../../env/server.mjs";
import Harvest from "../../../providers/harvest";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session }) {
      // if (session.user) {
      //   session.user.id = user.id;
      // }
      return session;
    },
    jwt: (params)=> {
      const {account, token, profile} = params;
      const p: any = profile;
      if (account?.access_token) {
        token.access_token = account.access_token;
      }
      if(p?.accounts) {
        token.accounts = p.accounts;
      }
      return token;
    },
  },
  // Configure one or more authentication providers
  providers: [
    Harvest({
      clientId: env.HARVEST_CLIENT_ID!,
      clientSecret: env.HARVEST_CLIENT_SECRET!
    })
  ],
  //debug: true,
};

export default NextAuth(authOptions);
