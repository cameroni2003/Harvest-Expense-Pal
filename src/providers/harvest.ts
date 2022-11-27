import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface HarvestProfile extends Record<string, any> {
    user: any,
    accounts: any
}

export default function HarvestProvider<P extends HarvestProfile>(
    options: OAuthUserConfig<P>
): OAuthConfig<P> {
    return {
        id: "harvest",
        name: "Harvest",
        type: "oauth",
        authorization: `https://id.getharvest.com/oauth2/authorize`,
        userinfo: "https://id.getharvest.com/api/v2/accounts",
        token: {
            url: "https://id.getharvest.com/api/v2/oauth2/token",
            async request(context) {

                const myHeaders = new Headers();
                myHeaders.append("User-Agent", "NextAuth Harvest Provider");
                myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                const urlencoded = new URLSearchParams();
                urlencoded.append("code", context.params.code!);
                urlencoded.append("client_id", context.provider.clientId!);
                urlencoded.append("client_secret", context.provider.clientSecret!);
                urlencoded.append("grant_type", "authorization_code");

                const requestOptions: RequestInit = {
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
                        expires_at: Date.now() + tokens.expires_in,
                    }
                }
            },
        },
        client: {
            token_endpoint_auth_method: "client_secret_post"
        },
        profile(profile, tokens) {
            console.log('tokens', tokens)
            return {
                id: profile.user.id,
                name: profile.user.first_name,
                accounts: profile.accounts,
                accessToken: tokens.access_token
            }
        },
        options
    }
}