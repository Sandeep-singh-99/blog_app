"use client";
import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Loading Card */}
      <div className="relative z-10 w-[90%] max-w-md rounded-2xl border bg-card/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        {/* Animated Loader */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute h-20 w-20 rounded-full border-4 border-primary/20" />
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold tracking-tight">
          Preparing your dashboard
        </h1>

        {/* Description */}
        <p className="mt-2 text-sm text-muted-foreground">
          Loading your analytics, articles, and personalized data...
        </p>

        {/* Progress Bar */}
        <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-primary" />
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Please wait a moment
        </p>
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
