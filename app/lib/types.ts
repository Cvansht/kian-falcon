export interface QuotationRequest {
  client_name: string;
  item_cost_inr: number;
  sales_markup_percentage: number;
}

export interface QuotationResponse {
  proforma_invoice_id: string;
  final_selling_price_inr: number;
  gross_profit_inr: number;
  client_name: string;
}