import { customAlphabet } from "nanoid";
import type { QuotationRequest, QuotationResponse } from "./types";

const digits = customAlphabet("0123456789", 6);
export function generateInvoice(date = new Date()) {
  return `KFM-PI-${date.getFullYear()}-${digits()}`;
}
export function calculateQuotation(req: QuotationRequest): QuotationResponse {
  const selling = req.item_cost_inr * (1 + req.sales_markup_percentage / 100);
  const profit = selling - req.item_cost_inr;

  return {
    proforma_invoice_id : generateInvoice(),
    final_selling_price_inr : Number (selling.toFixed(2)),
    gross_profit_inr : Number(profit.toFixed(2)),
    client_name : req.client_name ,
 }
}
 
