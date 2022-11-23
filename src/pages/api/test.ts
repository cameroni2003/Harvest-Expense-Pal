import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt"
import { getSession, useSession } from "next-auth/react";
import { getServerAuthSession } from "../../server/common/get-server-auth-session";
import useHarvest from "../../server/services/harvest-service"

export default async (req: any, res: any) => {
    const token: any = await getToken({req})
    const accountId = token.accounts[0]
    const harvest = useHarvest(token?.access_token, accountId.id)
    res.send(await harvest.clients.list())
    
    res.end();
}