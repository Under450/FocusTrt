import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FocusTRT — Admin",
  description: "Men's optimisation content pipeline",
  robots: { index: false, follow: false }, // admin tool, not public
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
