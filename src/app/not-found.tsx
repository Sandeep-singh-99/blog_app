"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e293b_0%,#000_50%)]" />
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
        <div className="mb-4 text-8xl font-black tracking-tight text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text">
          404
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">
          Page Not Found
        </h1>

        <p className="mb-8 text-gray-400">
          The page you're looking for doesn't exist, was moved,
          or you may have entered an incorrect URL.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:scale-105"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}