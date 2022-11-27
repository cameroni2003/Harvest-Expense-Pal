import useHarvest from "../../services/harvest-service";
import { protectedProcedure, router } from "../trpc";
import _transform from "lodash.transform";
import type { HarvestAccount, JWTExt } from "next-auth";

export const harvestRouter = router({
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const token: JWTExt | null = await ctx.token;
    const accountId = token?.accounts?.[0] as HarvestAccount;
    const harvest = useHarvest(
      token?.access_token ?? "",
      accountId.id.toString()
    );

    const projects = await harvest.projects.list();

    const transformedProjects = _transform(
      projects.projects,
      (result: any, value: any) => {
        (result[value.client.name] || (result[value.client.name] = [])).push(
          value
        );
      },
      {}
    );

    return transformedProjects;
  }),

  getExpenseCategories: protectedProcedure.query(async ({ ctx }) => {
    const token: JWTExt | null = await ctx.token;
    const accountId = token?.accounts?.[0] as HarvestAccount;
    const harvest = useHarvest(
      token?.access_token ?? "",
      accountId.id.toString()
    );

    const expenseCategories = await harvest.expenseCategories.list({
      is_active: true,
      updated_since: "",
    });

    return expenseCategories.expense_categories;
  }),

  createExpense: protectedProcedure.query(async ({ ctx }) => {
    return { success: true };
  }),
});
