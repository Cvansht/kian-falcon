import {z} from "zod" ;
export const quotationSchema = z.object({
    client_name : z.string().trim().min(1 ,"Client name is required"),
    item_cost_inr : z.coerce.number().positive("Item cost must be greater than 0"),
    sales_markup_percentage : z.coerce
    .number()
    .min(0, "Markup cannot be negative")
    .max(500, "Markup cannot exceed 500%"),
});
export type QuotationInput = z.infer<typeof quotationSchema>;