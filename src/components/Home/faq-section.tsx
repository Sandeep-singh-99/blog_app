"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes NoteVault different from Notion, Obsidian, or 1Password?",
      a: "NoteVault is the first workspace that natively consolidates your rich markdown notes, PDF documents, Kanban projects, daily tasks, and a zero-knowledge encrypted secrets vault in one single client. You no longer need to pay for four separate subscriptions or constantly switch apps when building projects.",
    },
    {
      q: "How does the Zero-Knowledge Encrypted Vault work?",
      a: "Your sensitive credentials, API keys, and private thoughts are encrypted directly inside your browser runtime using military-grade AES-256-GCM. Decryption keys are derived locally with Argon2id using your master password. Neither our servers nor any third party can ever inspect your raw plaintext.",
    },
    {
      q: "Can I upload and annotate PDFs and technical papers?",
      a: "Yes! NoteVault includes an integrated PDF reader with full OCR indexing. You can view PDFs side-by-side with your active note, highlight passages, and automatically extract quotes and citations directly into your engineering documents.",
    },
    {
      q: "How do tasks and projects connect with my notes?",
      a: "Any checkbox or action item created inside your markdown notes automatically feeds into your centralized Task Inbox. Furthermore, project boards allow you to link specific architecture notes and PDF specs directly to Kanban cards and sprint milestones.",
    },
    {
      q: "Can I export my data or use NoteVault without vendor lock-in?",
      a: "Absolutely. We strongly believe your second brain belongs to you. You can export all your notes as standard Markdown (.md) files, documents as original PDFs, and project data as JSON at any time with a single click.",
    },
    {
      q: "Is my personal data or knowledge ever used for AI training?",
      a: "Never. NoteVault has a strict zero-telemetry and zero-training policy for all user vaults, notes, and documents. Your private workspace is 100% confidential.",
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-32 relative bg-muted/15 border-t border-border/60">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-muted-foreground">
            Everything you need to know about NoteVault, security, and workspace features.
          </p>
        </div>

        <div className="mt-12 space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left text-sm sm:text-base font-bold text-foreground hover:bg-muted/40 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-4 animate-in fade-in-50 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
