import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusTRT — Evidence-Based TRT Education",
  description:
    "Research-backed TRT podcasts, UK clinic directory, and members community. Evidence-based testosterone replacement therapy education for men.",
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
