"use client";

import { useState } from "react";
import ResultCard from "./ResultCard";
import type { QuotationResponse } from "../lib/types";
import { quotationSchema } from "../lib/validation/quotation";

type FormValues = {
  client_name: string;
  item_cost_inr: string;
  sales_markup_percentage: string;
};

type FieldErrors = Partial<Record<keyof FormValues, string>>;

const inputClassName =
  "w-full rounded-2xl border border-[#d9cfc0] bg-white px-4 py-3 text-[#1f1a14] shadow-sm outline-none transition focus:border-[#1f6f5c] focus:ring-4 focus:ring-[#1f6f5c]/15";

const initialValues: FormValues = {
  client_name: "",
  item_cost_inr: "",
  sales_markup_percentage: "",
};

export default function QuotationForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [result, setResult] = useState<QuotationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(name: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const parsed = quotationSchema.safeParse(values);

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const [field, messages] of Object.entries(parsed.error.flatten().fieldErrors)) {
        if (messages && messages.length > 0) {
          nextErrors[field as keyof FormValues] = messages[0];
        }
      }

      setFieldErrors(nextErrors);
      setResult(null);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/generate-quotation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsed.data),
      });

      const payload = await response.json();

      if (!response.ok) {
        if (payload?.errors?.fieldErrors) {
          const nextErrors: FieldErrors = {};

          for (const [field, messages] of Object.entries(payload.errors.fieldErrors)) {
            if (Array.isArray(messages) && messages.length > 0) {
              nextErrors[field as keyof FormValues] = String(messages[0]);
            }
          }

          setFieldErrors(nextErrors);
        }

        setResult(null);
        setSubmitError(payload?.message ?? "Something went wrong. Please retry.");
        return;
      }

      setFieldErrors({});
      setResult(payload as QuotationResponse);
    } catch {
      setResult(null);
      setSubmitError("Unable to reach the server. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="rounded-4xl border border-[#d9cfc0]/80 bg-[#fffdf8]/95 p-6 shadow-[0_20px_60px_rgba(31,26,20,0.08)] backdrop-blur sm:p-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1f6f5c]">
            Pricing input
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#1f1a14]">
            Generate a quote in one step
          </h2>
        </div>
        <p className="max-w-md text-sm leading-6 text-[#6b6256]">
          The form validates on the client first, then re-checks on the API
          route before calculating selling price and gross profit.
        </p>
      </div>

      <form className="grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#6b6256]">Client name</span>
            <input
              className={inputClassName}
              name="client_name"
              type="text"
              placeholder="Acme Trading Co."
              value={values.client_name}
              onChange={(event) => updateValue("client_name", event.target.value)}
            />
            {fieldErrors.client_name ? (
              <small className="text-sm font-medium text-[#b42318]">
                {fieldErrors.client_name}
              </small>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#6b6256]">
              Item cost (INR)
            </span>
            <input
              className={inputClassName}
              name="item_cost_inr"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="10000"
              value={values.item_cost_inr}
              onChange={(event) => updateValue("item_cost_inr", event.target.value)}
            />
            {fieldErrors.item_cost_inr ? (
              <small className="text-sm font-medium text-[#b42318]">
                {fieldErrors.item_cost_inr}
              </small>
            ) : null}
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[#6b6256]">
              Sales markup (%)
            </span>
            <input
              className={inputClassName}
              name="sales_markup_percentage"
              type="number"
              min="0"
              max="500"
              step="0.01"
              placeholder="25"
              value={values.sales_markup_percentage}
              onChange={(event) =>
                updateValue("sales_markup_percentage", event.target.value)
              }
            />
            {fieldErrors.sales_markup_percentage ? (
              <small className="text-sm font-medium text-[#b42318]">
                {fieldErrors.sales_markup_percentage}
              </small>
            ) : null}
          </label>
        </div>

        {submitError ? (
          <p className="rounded-2xl border border-[#f3c7c2] bg-[#fff1f0] px-4 py-3 text-sm font-medium text-[#b42318]">
            {submitError}
          </p>
        ) : null}

        <button
          className="inline-flex min-w-52 items-center justify-center rounded-full bg-[#1f6f5c] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#174f42] disabled:cursor-wait disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generating..." : "Generate quotation"}
        </button>
      </form>

      {result ? <ResultCard result={result} /> : null}
    </section>
  );
}
