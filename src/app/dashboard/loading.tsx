"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="relative flex min-h-[calc(100vh-14rem)] w-full items-center justify-center p-4">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl"
      />

      {/* Minimal Modern Glass Card */}
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center rounded-2xl border border-border/60 bg-card/50 p-8 text-center shadow-xs backdrop-blur-xl">
        {/* Modern Loader Icon Container */}
        <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl border border-border/80 bg-background/80 shadow-xs backdrop-blur-sm" />
          <div className="absolute inset-0 rounded-2xl border border-primary/20 animate-pulse" />
          <Loader2 className="relative h-6 w-6 animate-spin text-primary" />
        </div>

        {/* Heading */}
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Preparing your workspace
        </h2>

        {/* Description */}
        <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground max-w-[260px]">
          Loading your notes, documents, projects, and encrypted vault...
        </p>

        {/* Sleek Indeterminate Progress Bar */}
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-muted/80">
          <div className="indeterminate-bar h-full w-1/3 rounded-full bg-primary" />
        </div>

        {/* Micro Status Indicator */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span>Syncing workspace</span>
        </div>
      </div>

      {/* Smooth Keyframe Animation */}
      <style>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(350%);
          }
        }
        .indeterminate-bar {
          animation: indeterminate 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}

