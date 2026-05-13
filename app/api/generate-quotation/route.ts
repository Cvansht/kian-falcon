import { NextResponse } from "next/server";
import { quotationSchema } from "../../lib/validation/quotation";
import { calculateQuotation } from "../../lib/QuotationService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quotationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const result = calculateQuotation(parsed.data);
    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload" },
      { status: 500 },
    );
  }
}
