# Kian Falcon Mini Quotation Generator

A lightweight full-stack quotation generator built with Next.js App Router. The app accepts a client name, item cost, and sales markup percentage, then calculates the final selling price, gross profit, and a unique proforma invoice ID. It also supports exporting the generated quotation as a PDF.

## Overview

This project is designed as a small but production-aware full-stack exercise:

- Single-page user flow
- Typed client and server contract
- Shared runtime validation
- Pure business-logic layer
- API route inside the Next.js app
- Client-side PDF export

## Architecture

The application follows a simple layered flow:

```text
Browser UI
   ->
Client-side validation (Zod)
   ->
POST /api/generate-quotation
   ->
Server-side validation (Zod)
   ->
Quotation service (business logic)
   ->
JSON response
   ->
Result card + optional PDF export
```

### Layer Responsibilities

| Layer | Responsibility | File |
| --- | --- | --- |
| Page shell | Renders the landing section and mounts the quotation form | `app/page.tsx` |
| Form UI | Collects user input, validates it, submits to API, handles loading and errors | `app/components/Quotation-form.tsx` |
| Result UI | Displays invoice details and exposes PDF export | `app/components/ResultCard.tsx` |
| API route | Accepts POST requests, validates payload, returns calculated quotation | `app/api/generate-quotation/route.ts` |
| Validation schema | Shared request validation rules | `app/lib/validation/quotation.ts` |
| Business logic | Generates invoice ID and performs pricing calculations | `app/lib/QuotationService.ts` |
| Shared types | Defines request and response shapes | `app/lib/types.ts` |
| PDF export | Builds and downloads the invoice PDF on the client | `app/lib/quotationPdf.ts` |

## Process Flow

### 1. User input

The user fills in:

- `client_name`
- `item_cost_inr`
- `sales_markup_percentage`

### 2. Client-side validation

Before the request is sent, the form validates:

- client name must not be empty
- item cost must be greater than `0`
- markup must be between `0` and `500`

If any validation fails, inline field errors are shown and the API is not called.

### 3. API request

The form sends a `POST` request to:

```text
/api/generate-quotation
```

Example request body:

```json
{
  "client_name": "Acme Trading Co.",
  "item_cost_inr": 10000,
  "sales_markup_percentage": 25
}
```

### 4. Server-side validation

The API route validates the incoming body again using the same rules for defense in depth.

### 5. Business logic

The quotation service calculates:

```text
final_selling_price_inr = item_cost_inr * (1 + sales_markup_percentage / 100)
gross_profit_inr = final_selling_price_inr - item_cost_inr
proforma_invoice_id = KFM-PI-<year>-<random-6-digit-sequence>
```

### 6. Result rendering

The response is rendered in the result card with:

- invoice ID
- client name
- final selling price
- gross profit

### 7. PDF export

Once a quotation is generated, the user can export it as a PDF. The PDF is created in the browser using `jsPDF` and downloaded with the invoice ID as the filename.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 |
| UI | React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Validation | Zod |
| ID generation | nanoid |
| PDF export | jsPDF |
| Package manager | npm |

## Project Structure

```text
app/
  api/
    generate-quotation/
      route.ts
  components/
    Quotation-form.tsx
    ResultCard.tsx
  lib/
    QuotationService.ts
    quotationPdf.ts
    types.ts
    validation/
      quotation.ts
  global.css
  layout.tsx
  page.tsx

next-env.d.ts
package.json
postcss.config.mjs
tsconfig.json
README.md
```

## API Contract

### Endpoint

```text
POST /api/generate-quotation
```

### Request Body

```json
{
  "client_name": "Acme Trading Co.",
  "item_cost_inr": 10000,
  "sales_markup_percentage": 25
}
```

### Success Response

```json
{
  "proforma_invoice_id": "KFM-PI-2026-123456",
  "final_selling_price_inr": 12500,
  "gross_profit_inr": 2500,
  "client_name": "Acme Trading Co."
}
```

### Validation Error Response

```json
{
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "client_name": ["Client name is required"],
      "item_cost_inr": ["Item cost must be greater than 0"],
      "sales_markup_percentage": ["Markup cannot exceed 500%"]
    }
  }
}
```

## Features

- Generate quotation in a single flow
- Strong client and server validation
- Unique invoice ID generation
- Final selling price calculation
- Gross profit calculation
- Responsive UI built with Tailwind CSS
- Export generated quotation as PDF

## Run Locally

### Prerequisites

- Node.js 18+ recommended
- npm

### Installation

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

### Start the production build locally

```bash
npm run start
```

### Type-check the project

```bash
npm run typecheck
```

## Manual Test Example

Use the following input in the UI:

- Client name: `Acme Trading Co.`
- Item cost: `10000`
- Sales markup: `25`

Expected result:

- Final selling price: `INR 12,500.00`
- Gross profit: `INR 2,500.00`
- A generated invoice ID similar to `KFM-PI-2026-123456`

Then click `Export invoice as PDF` to download the invoice PDF.

## Notes

- PDF export is generated on the client side.
- The exported PDF uses `INR` text formatting for price values to avoid font issues with special currency symbols in default PDF fonts.
- No database is used in the current version; invoice IDs are generated dynamically in memory.
