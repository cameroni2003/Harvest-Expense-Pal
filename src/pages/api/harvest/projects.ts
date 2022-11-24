import { getToken } from "next-auth/jwt"
import useHarvest from "../../../server/services/harvest-service"
import _transform from "lodash.transform"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token: any = await getToken({req})
    const accountId = token.accounts[0]
    const harvest = useHarvest(token?.access_token, accountId.id)

    const projects = await harvest.projects.list()

    const transformedProjects = _transform(projects.projects, (result: any, value: any, key, obj) => {
        (result[value.client.name] || (result[value.client.name] = [])).push(value)
    }, {})

    res.send(transformedProjects)
}