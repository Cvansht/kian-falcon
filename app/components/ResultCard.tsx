import type { QuotationResponse } from "../lib/types";

type ResultCardProps = {
  result: QuotationResponse;
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="mt-8 rounded-[1.75rem] border border-[#d7e6df] bg-[linear-gradient(135deg,rgba(255,248,236,0.98),rgba(245,255,250,0.98))] p-6 shadow-[0_20px_50px_rgba(31,26,20,0.08)] sm:p-7">
      <div className="mb-6 grid gap-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6b6256]">
          Proforma invoice ID
        </p>
        <code className="w-fit rounded-full bg-[#1f6f5c]/10 px-4 py-2 font-mono text-sm font-bold text-[#174f42]">
          {result.proforma_invoice_id}
        </code>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <p className="text-sm font-semibold text-[#6b6256]">Client</p>
          <p className="mt-1 text-lg font-semibold text-[#1f1a14]">
            {result.client_name}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#6b6256]">
            Final selling price
          </p>
          <p className="mt-1 text-lg font-semibold text-[#1f1a14]">
            {inrFormatter.format(result.final_selling_price_inr)}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-[#6b6256]">Gross profit</p>
          <p className="mt-1 text-lg font-semibold text-[#1f6f5c]">
            {inrFormatter.format(result.gross_profit_inr)}
          </p>
        </div>
      </div>
    </article>
  );
}
