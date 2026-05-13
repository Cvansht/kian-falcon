import QuotationForm from "./components/Quotation-form";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <section className="relative mb-8 overflow-hidden rounded-4xl border border-black/5 bg-white/70 p-8 shadow-[0_30px_80px_rgba(31,26,20,0.08)] backdrop-blur sm:p-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(31,111,92,0.14),transparent_70%)] lg:block" />
        <div className="relative max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.32em] text-[#1f6f5c]">
            Kian Falcon
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-[#1f1a14] sm:text-5xl md:text-6xl">
            Mini Quotation Generator
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#6b6256] sm:text-lg">
          Enter a client, cost price, and markup percentage to generate a
          proforma invoice preview with selling price and gross profit.
          </p>
        </div>
      </section>

      <QuotationForm />
    </main>
  );
}
