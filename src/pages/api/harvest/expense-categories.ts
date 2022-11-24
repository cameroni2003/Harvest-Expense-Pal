import { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import useHarvest from "../../../server/services/harvest-service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token: any = await getToken({ req })
    const accountId = token.accounts[0]
    const harvest = useHarvest(token?.access_token, accountId.id)

    const expenseCategories = await harvest.expenseCategories.list({ is_active: true, updated_since: '' })
    
    res.send(expenseCategories.expense_categories)
}