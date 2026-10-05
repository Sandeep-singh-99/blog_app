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
    default: "NoteVault | Personal Knowledge & Project Management Workspace",
    template: "%s | NoteVault",
  },
  icons: {
    icon: "/favicon.ico",
  },
  description: "Personal Workspace — Manage notes, PDFs/documents, projects, encrypted secrets, tasks, and personal knowledge in one secure place.",
  keywords: [
    "note taking",
    "personal knowledge management",
    "pkm",
    "project management",
    "encrypted vault",
    "pdf annotator",
    "zero-knowledge",
    "task manager",
    "second brain",
    "developer workspace",
  ],
  authors: [{ name: "NoteVault Team" }],
  creator: "NoteVault Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NoteVault",
    title: "NoteVault | Personal Knowledge & Project Management Workspace",
    description: "Personal Workspace — Manage notes, PDFs/documents, projects, encrypted secrets, tasks, and personal knowledge in one secure place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NoteVault - Personal Knowledge & Project Management Workspace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteVault | Personal Knowledge & Project Management Workspace",
    description: "Personal Workspace — Manage notes, PDFs/documents, projects, encrypted secrets, tasks, and personal knowledge in one secure place.",
    images: ["/og-image.png"],
    creator: "@notevault",
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
