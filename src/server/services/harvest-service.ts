import Harvest from "harvest";

export default function useHarvest(access_token: string, accountId: string) {
    const harvestclient = new Harvest({
        auth: {
            accessToken: access_token,
            accountId: accountId
        },
        subdomain: "f4af4576a2845d32dfd76f2012f1c6c1",
        userAgent: "test"
    })
    return harvestclient
}