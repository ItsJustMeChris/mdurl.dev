import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mdurl — clean markdown for agents",
  description:
    "A curl-shaped CLI that fetches webpages and search results as clean, predictable markdown for coding agents and LLM tools.",
  metadataBase: new URL("https://mdurl.dev"),
  openGraph: {
    title: "mdurl",
    description:
      "A curl-shaped CLI that fetches webpages as clean markdown for agents.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-dvh">{children}</body>
    </html>
  );
}
