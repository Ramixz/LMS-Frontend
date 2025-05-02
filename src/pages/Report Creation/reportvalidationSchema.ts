import { z } from "zod";

export const ReportFormSchema = z.object({
  reportName: z.string().min(1, "Report name is required"),
  dashboards: z
    .array(
      z.object({
        dashboardId: z.string().min(1, "Dashboard selection is required"),
        timePeriod: z.string().min(1, "Time period is required"),
      })
    )
    .min(1, "At least one dashboard must be selected"),
  contacts: z.array(z.string()).min(1, "At least one contact must be selected"),
  channels: z.string().min(1, "At least one channel must be selected"),
    cronExpression: z.string().min(1, "Cron expression is required"),
});
