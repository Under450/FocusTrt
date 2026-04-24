import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ELEVATE — TRT & HRT",
  description:
    "Optimise · Restore · Rebalance. Evidence-based TRT and HRT programmes with clinician-led protocols.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
