import { unstable_getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt"
import { getSession, useSession } from "next-auth/react";
import { getServerAuthSession } from "../../../server/common/get-server-auth-session";
import useHarvest from "../../../server/services/harvest-service"
import _transform from "lodash.transform"

export default async (req: any, res: any) => {
    const token: any = await getToken({req})
    const accountId = token.accounts[0]
    const harvest = useHarvest(token?.access_token, accountId.id)

    const projects = await harvest.projects.list()

    const transformedProjects = _transform(projects.projects, (result: any, value: any, key, obj) => {
        //console.log('value', value)
        (result[value.client.name] || (result[value.client.name] = [])).push(value)
    }, {})

    res.send(transformedProjects)
    
    res.end();
}