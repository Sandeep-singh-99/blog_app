"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Sparkles, ArrowRight, Lock, Layers } from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-indigo-600/15 blur-[140px] dark:bg-indigo-500/25" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-background to-violet-950/20 p-8 sm:p-14 lg:p-20 text-center shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Get Started in 30 Seconds</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground">
              Take Control of Your Personal Knowledge & Secrets
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of developers, researchers, and project builders who manage
              their notes, PDFs, code, tasks, and credentials in NoteVault.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-8 text-base font-bold text-white shadow-lg shadow-indigo-500/30 hover:opacity-95 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5" />
                      <span>Start Your Vault Free</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto h-12 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-8 text-base font-bold text-white shadow-lg shadow-indigo-500/30 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="h-5 w-5" />
                      <span>Open NoteVault Workspace</span>
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Button>
                </Link>
              </SignedIn>

              <Link href="#workspace" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-full border-border/80 bg-background/80 px-8 text-base font-semibold hover:bg-accent transition-all"
                >
                  <span>See Interactive Tour</span>
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                <span>Zero-Knowledge Protected</span>
              </span>
              <span>•</span>
              <span>No Credit Card Required</span>
              <span>•</span>
              <span>Full Data Export Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
