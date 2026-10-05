"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="relative z-10 max-w-lg rounded-3xl border border-border bg-card p-10 text-center shadow-xl">
        <div className="mb-4 text-8xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
          404
        </div>

        <h1 className="mb-3 text-3xl font-bold text-foreground">
          Page Not Found
        </h1>

        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist, was moved,
          or you may have entered an incorrect URL.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 shadow-sm cursor-pointer"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-xl border border-border bg-muted/50 px-5 py-3 font-medium text-foreground transition hover:bg-muted cursor-pointer"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}