import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { TokenEndpointHandler } from "next-auth/providers/oauth.js";
import { getProviders } from "next-auth/react/index.js";

import { env } from "../../../env/server.mjs";
import HarvestProvider from "../../../providers/harvest-provider";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, token, user }) {
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
    HarvestProvider({
      clientId: process.env.HARVEST_CLIENT_ID!,
      clientSecret: process.env.HARVEST_CLIENT_SECRET!
    })
  ],
  //debug: true,
};

export default NextAuth(authOptions);
