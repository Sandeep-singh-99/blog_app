"use client";

import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileText,
  FolderKanban,
  CheckCircle2,
  Circle,
  Sparkles,
  KeyRound,
  FileUp,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function InteractiveBento() {
  // Vault secret demo states
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Note demo formatting states
  const [activeTag, setActiveTag] = useState("Architecture");
  const [noteWordCount, setNoteWordCount] = useState(384);

  // Project tasks checklist demo states
  const [projectTasks, setProjectTasks] = useState([
    { id: 1, title: "Implement AES-256 client crypto engine", done: true },
    { id: 2, title: "Optimize PDF OCR indexing pipeline", done: true },
    { id: 3, title: "Build responsive dark/light theme switch", done: true },
    { id: 4, title: "Run end-to-end zero-knowledge security audit", done: false },
  ]);

  const toggleTask = (id: number) => {
    setProjectTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const completedCount = projectTasks.filter((t) => t.done).length;
  const progressPercent = Math.round((completedCount / projectTasks.length) * 100);

  return (
    <section id="workspace" className="py-20 md:py-32 relative bg-muted/20 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
            <Zap className="h-3.5 w-3.5 text-cyan-500" />
            <span>Interactive Workspace Playground</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Experience the Speed of NoteVault
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Test drive the core workspace features directly on this page. Everything is
            engineered for instantaneous speed, privacy, and fluid organization.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Interactive Note Editor (7 cols on lg) */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Rich Markdown Knowledge Engine
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Interactive editor simulation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-full text-xs font-mono text-muted-foreground">
                  <span>{noteWordCount} words</span>
                </div>
              </div>

              {/* Tag Selector buttons */}
              <div className="flex items-center gap-2 pt-2 overflow-x-auto">
                <span className="text-xs text-muted-foreground">Topic:</span>
                {["Architecture", "Security Specs", "Database Internals", "Meeting Notes"].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(tag)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                        activeTag === tag
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                )}
              </div>

              {/* Interactive simulated document editor */}
              <div className="rounded-2xl border border-border/70 bg-background/80 p-4 sm:p-5 space-y-3 font-sans shadow-inner">
                <div className="flex items-center justify-between border-b border-border/50 pb-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Document: {activeTag.toLowerCase().replace(" ", "_")}_v2.md
                  </span>
                  <span className="text-[11px] text-emerald-500 font-medium">Auto-saved</span>
                </div>

                <div className="text-sm font-semibold text-foreground">
                  # {activeTag} Deep Dive: Resilient Distributed State
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  NoteVault treats your knowledge base as a connected graph. Every document
                  links bidirectionally to other concepts. Below is our verified state machine
                  specification:
                </p>

                <div className="rounded-xl border border-border/60 bg-muted/40 p-3 font-mono text-xs text-foreground/90">
                  <div className="text-indigo-400 font-semibold mb-1">
                    {"// Internal Cryptographic Verification Chain"}
                  </div>
                  <div>
                    const blockHash = sha256(notePayload + timestamp);
                  </div>
                  <div className="text-emerald-500">
                    verifySignature(blockHash, clientPublicKey); // OK
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    [[Raft Consensus]]
                  </span>
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-indigo-600 dark:text-indigo-400 font-medium">
                    [[Database Sharding]]
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    + 3 linked documents
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
              <span>Supports KaTeX formulas, tables, code formatting</span>
              <span className="text-primary font-semibold flex items-center gap-1">
                Zero lag markdown <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Bento Card 2: Interactive Secrets Vault (5 cols on lg) */}
          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Client-Encrypted Vault
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Live interactive secret unlock
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  AES-256
                </span>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                Test decrypting a simulated confidential secret key. Notice how values are
                masked and never stored as plain text.
              </p>

              {/* Interactive Secret Key Card */}
              <div className="rounded-2xl border border-border/70 bg-background/90 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-amber-500" />
                    <span>STRIPE_LIVE_SECRET_KEY</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealed(!revealed)}
                    className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                  >
                    {revealed ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        <span>Hide Key</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        <span>Reveal Key</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-muted/60 p-2.5 font-mono text-xs">
                  <span className="tracking-widest font-semibold select-all text-foreground truncate mr-2">
                    {revealed ? "sk_live_51Mza89q18nv918k2" : "••••••••••••••••••••••"}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 rounded-md bg-background px-2 py-1 text-xs font-sans text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Argon2 Key Derivation • 100% Zero Knowledge</span>
                </div>
              </div>

              {/* Second Secret item */}
              <div className="rounded-2xl border border-border/70 bg-background/90 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <KeyRound className="h-3.5 w-3.5 text-cyan-500" />
                  <div>
                    <div className="font-semibold text-foreground">GITHUB_PERSONAL_ACCESS_TOKEN</div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      ••••••••••••••••••••••••
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  Locked
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
              <span>Clipboard automatically clears after 30s</span>
              <span className="text-emerald-500 font-semibold">100% Client-Side</span>
            </div>
          </div>

          {/* Bento Card 3: Interactive Project Kanban & Deliverables (6 cols on lg) */}
          <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500">
                    <FolderKanban className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Agile Projects & Sprints
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Interactive task milestone tracker
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-bold text-violet-600 dark:text-violet-400">
                  {progressPercent}% Done
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Interactive task checkboxes */}
              <div className="space-y-2 pt-1">
                {projectTasks.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTask(t.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left text-xs transition-all ${
                      t.done
                        ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground line-through"
                        : "border-border/70 bg-background hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex-1 font-medium">{t.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
              <span>Linked directly with your notes and milestones</span>
              <span className="text-violet-500 font-semibold flex items-center gap-1">
                Manage Sprints <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Bento Card 4: PDF & Document Intelligence Hub (6 cols on lg) */}
          <div className="lg:col-span-6 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-xl transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500">
                    <FileUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Smart PDF & Document Hub
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      High-fidelity PDF reader with OCR
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-cyan-500/15 px-2.5 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                  OCR Active
                </span>
              </div>

              {/* PDF Preview Widget */}
              <div className="rounded-2xl border border-border/70 bg-background/90 p-4 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <BookOpen className="h-4 w-4 text-cyan-500" />
                    <span>Distributed_Systems_Patterns.pdf</span>
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Page 48 of 192
                  </span>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-foreground flex items-center justify-between">
                    <span>Highlighted Extract in Note:</span>
                    <span className="text-cyan-500 text-[10px]">Synced to active note</span>
                  </div>
                  <blockquote className="border-l-2 border-cyan-500 pl-2 text-muted-foreground italic text-[11px]">
                    "Consensus protocols must prioritize safety over liveness during network
                    partitions under CAP theorem constraints."
                  </blockquote>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                  <span>OCR text fully vector searchable</span>
                  <span className="text-emerald-500 font-semibold">Indexed in 0.4s</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/40">
              <span>Upload PDFs, epubs, markdown docs, and images</span>
              <span className="text-cyan-500 font-semibold flex items-center gap-1">
                Zero upload lag <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
