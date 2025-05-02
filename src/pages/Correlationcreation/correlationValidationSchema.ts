import { z } from 'zod';

export const CorrelationFormSchema = z.object({
  correlationName: z
    .string()
    .min(1, 'Please enter a name') // Minimum length validation
    .max(30, 'Maximum length is 30') // Maximum length validation
    .refine(
      (value) => /^[a-zA-Z]+([-'s]?[a-zA-Z]+)*$/.test(value),
      {
        message:
          'Name should contain only alphabets, hyphens, apostrophes.',
      }
    ),
  dashboards: z
    .array(
      z.object({
        dataset: z.string().min(1, 'Please select a dataset'), // Validation for dataset selection
        field: z.string().min(1, 'Please select a field'), // Validation for field selection
        index: z.string().optional(), // Optional, since not all cases might require index
      })
    )
    .min(1, { message: 'At least two dataset must be selected' }), // Ensure at least one dataset is selected
    datasetsToShow: z
    .array(z.string())
    .optional(), 
});
