import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediBot — Clinical Knowledge & Medical RAG Assistant",
  description:
    "AI-powered medical assistant providing grounded retrieval-augmented generation across clinical guidelines, research papers, and diagnostic PDFs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full bg-cream-50 text-medigray-800 antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-cream-50 font-sans"
      >
        {children}
      </body>
    </html>
  );
}
