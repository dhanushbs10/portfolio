import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dhanush Nagishetti — Portfolio",
    template: "%s | Dhanush Nagishetti",
  },
  description:
    "Portfolio of Dhanush Nagishetti — building at the intersection of infrastructure, systems, and design.",
  keywords: [
    "portfolio",
    "developer",
    "infrastructure",
    "homelab",
    "full-stack",
  ],
  authors: [{ name: "Dhanush Nagishetti" }],
  openGraph: {
    title: "Dhanush Nagishetti — Portfolio",
    description:
      "Building at the intersection of infrastructure, systems, and design.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface-base text-text-primary">
        <ThemeProvider defaultTheme="dark">
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
