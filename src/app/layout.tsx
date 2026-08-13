import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/shared/Nav";
import { Footer } from "@/components/shared/Footer";
import PageBackground from "@/components/PageBackground";
import PingWidget from "@/components/chat/PingWidget";
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
    default: "Dhanush B S, Cybersecurity & Networking Student",
    template: "%s | Dhanush B S",
  },
  description:
    "Portfolio of Dhanush B S, Diploma student in Computer Science Engineering from Bengaluru, focused on cybersecurity, networking, and infrastructure. Building toward a career as a Network Security Engineer.",
  keywords: [
    "Dhanush B S",
    "network security",
    "cybersecurity",
    "networking",
    "infrastructure",
    "homelab",
    "portfolio",
  ],
  authors: [{ name: "Dhanush B S" }],
  openGraph: {
    title: "Dhanush B S, Network Security Engineer",
    description:
      "Cybersecurity and networking enthusiast from Bengaluru. Building practical skills through hands-on projects and home lab experimentation.",
    type: "website",
    locale: "en_IN",
    images: ["/og-image.png"],
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
        <PageBackground />
        <ThemeProvider defaultTheme="dark">
          <Nav />
          <div className="flex-1">{children}</div>
          <Footer />
        </ThemeProvider>
        <PingWidget />
      </body>
    </html>
  );
}

