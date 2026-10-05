"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  HardDrive,
  FileCode,
  CheckCircle2,
  Cpu,
  Fingerprint,
} from "lucide-react";

export function SecuritySection() {
  const securityPillars = [
    {
      icon: Lock,
      title: "Zero-Knowledge Encryption",
      description:
        "Your encrypted vault entries are locked using AES-256-GCM. We mathematically cannot read your secrets, notes, or credentials.",
      tag: "AES-256-GCM",
    },
    {
      icon: KeyRound,
      title: "Argon2 Key Derivation",
      description:
        "Master passphrases undergo thousands of memory-hard Argon2 iterations before generating local decryption keys.",
      tag: "Argon2id",
    },
    {
      icon: Fingerprint,
      title: "Client-Side Cryptography",
      description:
        "Decryption occurs entirely within your browser runtime. Plaintext never travels over network wires.",
      tag: "Local Memory Only",
    },
    {
      icon: HardDrive,
      title: "Full Data Portability",
      description:
        "No vendor lock-in. Export your entire workspace into standard open Markdown, raw JSON, and PDF files anytime with one click.",
      tag: "100% Open Standards",
    },
  ];

  return (
    <section id="security" className="py-20 md:py-32 relative bg-background overflow-hidden">
      {/* Background glow effect */}
      <div className="pointer-events-none absolute bottom-10 right-1/4 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-emerald-500/30 bg-card p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl">
          {/* Subtle security grid watermark */}
          <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none hidden md:block">
            <ShieldCheck className="h-96 w-96 text-emerald-500" />
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Cryptographic Privacy Guarantee</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
              Your Thoughts & Secrets Belong Exclusively to You
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Unlike traditional cloud apps that scan and monetize your data for AI training,
              NoteVault is built from the ground up on zero-knowledge cryptographic
              architecture.
            </p>
          </div>

          {/* Pillars Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityPillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-background/80 p-5 space-y-3 backdrop-blur-md shadow-xs hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {p.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground">{p.title}</h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Technical Guarantee Badge */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Independent security audits verified</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Zero telemetry on user documents</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Offline-first local cache synchronization</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
