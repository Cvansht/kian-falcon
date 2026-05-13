import type { QuotationResponse } from "./types";

const numberFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export async function exportQuotationPdf(result: QuotationResponse) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;

  doc.setFillColor(31, 111, 92);
  doc.roundedRect(margin, margin, contentWidth, 110, 24, 24, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Kian Falcon", margin + 24, margin + 38);

  doc.setFontSize(16);
  doc.text("Proforma Invoice", margin + 24, margin + 66);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(
    `Generated on ${dateFormatter.format(new Date())}`,
    margin + 24,
    margin + 90,
  );

  doc.setTextColor(31, 26, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Invoice ID", margin, 210);

  doc.setFillColor(31, 111, 92, 0.1);
  doc.roundedRect(margin, 224, 220, 32, 16, 16, "F");
  doc.setTextColor(23, 79, 66);
  doc.setFont("courier", "bold");
  doc.setFontSize(11);
  doc.text(result.proforma_invoice_id, margin + 14, 245);

  doc.setTextColor(31, 26, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Quotation Summary", margin, 304);

  doc.setDrawColor(217, 207, 192);
  doc.roundedRect(margin, 322, contentWidth, 170, 20, 20, "S");

  const rows: Array<[string, string]> = [
    ["Client Name", result.client_name],
    [
      "Final Selling Price",
      `INR ${numberFormatter.format(result.final_selling_price_inr)}`,
    ],
    ["Gross Profit", `INR ${numberFormatter.format(result.gross_profit_inr)}`],
  ];

  let top = 356;

  rows.forEach(([label, value], index) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(107, 98, 86);
    doc.text(label, margin + 20, top);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.setTextColor(31, 26, 20);
    doc.text(value, margin + 20, top + 24);

    if (index < rows.length - 1) {
      doc.setDrawColor(232, 225, 213);
      doc.line(margin + 20, top + 42, pageWidth - margin - 20, top + 42);
    }

    top += 52;
  });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(107, 98, 86);
  doc.text(
    "This PDF was generated from the Kian Falcon Mini Quotation Generator.",
    margin,
    550,
  );

  doc.save(`${result.proforma_invoice_id}.pdf`);
}
