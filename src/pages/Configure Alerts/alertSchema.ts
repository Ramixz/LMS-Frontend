import { z } from "zod";

export const AlertFormSchema = z.object({
  alertName: z.string().min(1, "Alert name is required"),
  connector: z.string().min(1, "Connector is required"),
  dateField: z.string().min(1, "Date field is required"),
  function: z.string().min(1, "Function is required"),
  field: z.string().min(1, "Field is required"),
  timePeriodValue:  z.number().min(1, "Time period value must be greater than zero"),
  timePeriodUnit: z.string().min(1, "Time period unit is required"),
  count: z.string().min(1, "Count is required"),
  thresholds: z
    .array(
      z.object({
        value: z.number().min(1, "Value is required"),
        equation: z.string().min(1, "Equation is required"),
        severity: z.string().min(1, "Severity is required"),
      })
    )
    .min(1, "At least one threshold is required"),
  alertMessage: z.string().min(1, "Alert message is required"),
  cronExpression: z.string().min(1, "Cron expression is required"),
  contacts: z.array(z.string()).min(1, "At least one contact must be selected"),
  channels: z.string().min(1, "At least one channel must be selected"),});
