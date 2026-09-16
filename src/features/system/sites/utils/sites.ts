import * as z from 'zod';

export const siteFormSchema = z.object({
  siteName: z
    .string()
    .min(1, 'اسم الموقع مطلوب')
    .max(100, 'اسم الموقع لا يمكن أن يتجاوز 100 حرف'),
  siteCode: z
    .string()
    .min(1, 'رمز الموقع مطلوب')
    .max(20, 'رمز الموقع لا يمكن أن يتجاوز 20 حرف'),
  description: z
    .string()
    .max(500, 'الوصف لا يمكن أن يتجاوز 500 حرف')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(500, 'العنوان لا يمكن أن يتجاوز 500 حرف')
    .optional()
    .or(z.literal('')),
  isActive: z.boolean(),
  organizationalUnitIds: z.array(z.string())
});

export type SiteFormValues = z.infer<typeof siteFormSchema>;
