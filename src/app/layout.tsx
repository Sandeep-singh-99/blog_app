import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "BitWrite | A Modern Developer Blogging Platform",
    template: "%s | BitWrite",
  },
  description: "Read, write, and share technical stories with BitWrite. A modern blogging platform for developers to connect, share knowledge, and grow.",
  keywords: ["developer", "blog", "coding", "programming", "web development", "javascript", "react", "nextjs", "software engineering"],
  authors: [{ name: "BitWrite Team" }],
  creator: "BitWrite Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "BitWrite",
    title: "BitWrite | A Modern Developer Blogging Platform",
    description: "Read, write, and share technical stories with BitWrite. A modern blogging platform for developers to connect, share knowledge, and grow.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BitWrite - Developer Blogging Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BitWrite | A Modern Developer Blogging Platform",
    description: "Read, write, and share technical stories with BitWrite. A modern blogging platform for developers to connect, share knowledge, and grow.",
    images: ["/og-image.png"],
    creator: "@bitwrite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster richColors />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
