"use client";

import React from "react";
import {
  FilePlus,
  GitFork,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      step: "01",
      icon: FilePlus,
      title: "Capture Fast",
      subtitle: "Never let an insight slip away",
      description:
        "Instantly jot down engineering notes, drop PDF whitepapers, stash sensitive API credentials, or capture quick todos using global keyboard shortcuts.",
      badge: "Zero Friction",
      badgeColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500/30",
    },
    {
      step: "02",
      icon: GitFork,
      title: "Synthesize & Interlink",
      subtitle: "Build your second brain",
      description:
        "Connect ideas with bidirectional links, group documents by projects, tag concepts, and let your knowledge web evolve organically as you learn.",
      badge: "Connected Graph",
      badgeColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      step: "03",
      icon: CheckCircle2,
      title: "Execute & Protect",
      subtitle: "Ship work with confidence",
      description:
        "Track deliverables on Kanban boards, check off daily task inboxes, and keep your production credentials locked safe with AES-256 client encryption.",
      badge: "Encrypted & Actionable",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <section id="workflow" className="py-20 md:py-32 relative bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fluid Productivity Loop</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            From Mental Chaos to Complete Clarity
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            NoteVault mirrors how your brain actually works — associative, swift, and
            focused on shipping real results.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/20 via-cyan-500/20 to-emerald-500/20 -translate-y-12 -z-10" />

          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl font-black text-muted-foreground/40 group-hover:text-primary transition-colors">
                      {s.step}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${s.badgeColor}`}
                    >
                      {s.badge}
                    </span>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/70 text-foreground group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      {s.subtitle}
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
