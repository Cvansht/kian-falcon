import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Kian Falcon Mini Quotation Generator",
  description: "Generate proforma quotation details and gross profit instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(31,111,92,0.10),transparent_35%),linear-gradient(180deg,#fbf8f2_0%,#f4f1ea_100%)] text-[#1f1a14] antialiased selection:bg-[#1f6f5c]/20">
        {children}
      </body>
    </html>
  );
}
