import HeroSection from "@/components/Home/hero-section";
import { ModulesSection } from "@/components/Home/modules-section";
import { InteractiveBento } from "@/components/Home/interactive-bento";
import { WorkflowSection } from "@/components/Home/workflow-section";
import { SecuritySection } from "@/components/Home/security-section";
import { FAQSection } from "@/components/Home/faq-section";
import { CTASection } from "@/components/Home/cta-section";
import { Footer } from "@/components/Home/footer";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NoteVault | Personal Knowledge & Project Management Workspace",
  description:
    "Your private, all-in-one personal workspace. Manage rich notes, PDFs & documents, sprint projects, zero-knowledge encrypted secrets, tasks, and personal knowledge in one secure place.",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-300">
      {/* 1. Hero Section with Interactive App Workspace Mockup */}
      <HeroSection />

      {/* 2. The 6 Core Modules of NoteVault */}
      <ModulesSection />

      {/* 3. Interactive Bento Grid / Live Feature Demos */}
      <InteractiveBento />

      {/* 4. Workflow Section: From Chaos to Clarity */}
      <WorkflowSection />

      {/* 5. Security & Zero-Knowledge Encryption Pillar */}
      <SecuritySection />

      {/* 6. Frequently Asked Questions */}
      <FAQSection />

      {/* 7. Call To Action Banner */}
      <CTASection />

      {/* 8. Rebranded NoteVault Footer */}
      <Footer />
    </main>
  );
}
