import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { TokenEndpointHandler } from "next-auth/providers/oauth.js";
import { getProviders } from "next-auth/react/index.js";

import { env } from "../../../env/server.mjs";

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
    {
      authorization: `https://id.getharvest.com/oauth2/authorize`,
      userinfo: "https://id.getharvest.com/api/v2/accounts",
      token: {
        url: "https://id.getharvest.com/api/v2/oauth2/token",
        async request(context) {

          var myHeaders = new Headers();
          myHeaders.append("User-Agent", "MyApp (yourname@example.com)");
          myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

          var urlencoded = new URLSearchParams();
          urlencoded.append("code", context.params.code ?? '');
          urlencoded.append("client_id", context.provider.clientId ?? '');
          urlencoded.append("client_secret", context.provider.clientSecret ?? '');
          urlencoded.append("grant_type", "authorization_code");

          var requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
          };

          const tokenObj: any = context.provider.token;

          const tokens = await fetch(tokenObj.url, requestOptions)
            .then(response => response.json())
            .catch(error => console.log('error', error));

          console.log('tokens', tokens)

          return {
            tokens: {
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token,
              expires_at: Date.now() + tokens.expires_in
            }
          }
        },
      },
      type: "oauth",
      id: "harvest-provider",
      name: "harvest-provider",
      client: {
        token_endpoint_auth_method: "client_secret_post"
      },
      profile(profile, tokens) {
        return {
          id: profile.user.id,
          name: profile.user.first_name,
          accounts: profile.accounts
        }
      },
      clientId: "REDACTED_CLIENT_ID",
      clientSecret: "REDACTED_CLIENT_SECRET",
    }
  ],
  //debug: true,
};

export default NextAuth(authOptions);
