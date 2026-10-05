"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lock,
  FileText,
  FolderKanban,
  CheckCircle2,
  Circle,
  FileCode,
  FileUp,
  Search,
  KeyRound,
  Eye,
  EyeOff,
  Zap,
  Check,
  Copy,
  ChevronRight,
  ShieldAlert,
  HardDrive,
  Cpu,
} from "lucide-react";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

const HeroSection = () => {
  // Interactive states for the hero mockup
  const [tasks, setTasks] = useState([
    { id: 1, text: "Finalize AES-256 vault client encryption specs", completed: true },
    { id: 2, text: "Upload & OCR index distributed systems PDF manual", completed: true },
    { id: 3, text: "Map sprint milestones for Q4 project deliverables", completed: false },
    { id: 4, text: "Backup master recovery seed in offline safe", completed: false },
  ]);

  const [secretRevealed, setSecretRevealed] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleCopySecret = () => {
    setCopiedSecret(true);
    setTimeout(() => setCopiedSecret(false), 2000);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-dot-pattern">
      {/* Radiant ambient glow orbs */}
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 -translate-x-1/2 h-[500px] w-full max-w-7xl">
        <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-violet-600/15 blur-[120px] dark:bg-violet-500/20" />
        <div className="absolute top-20 right-1/4 h-80 w-80 rounded-full bg-cyan-600/15 blur-[120px] dark:bg-cyan-500/20" />
        <div className="absolute top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-600/15 blur-[140px] dark:bg-indigo-500/25" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Announcement Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-700 backdrop-blur-md shadow-xs transition-all hover:bg-indigo-500/20 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-spin-slow" />
            <span>NoteVault 2.0 • The Unified Personal Workspace</span>
            <span className="hidden sm:inline-block text-indigo-400">|</span>
            <span className="hidden sm:inline-block font-normal text-muted-foreground">
              Notes • PDFs • Projects • Secrets • Tasks
            </span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="mt-8 text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
            One Unified Workspace for Your{" "}
            <span className="block mt-1 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Knowledge, Projects & Secrets
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground font-normal leading-relaxed">
            Stop juggling 5 disconnected tools. NoteVault brings your rich markdown
            notes, PDF documents, project kanbans, action tasks, and zero-knowledge
            encrypted secrets into a single, private, blazing-fast personal vault.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 active:scale-95 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    <span>Launch NoteVault Free</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5" />
                    <span>Open Personal Workspace</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            </SignedIn>

            <Link href="#workspace" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 rounded-full border-border/80 bg-background/80 px-8 text-base font-semibold backdrop-blur-md hover:bg-accent transition-all"
              >
                <span>Explore Interactive Demo</span>
              </Button>
            </Link>
          </div>

          {/* Trust Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>AES-256 Encrypted</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Local-First Performance</span>
            </span>
            <span className="flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-cyan-500" />
              <span>Smart PDF Indexing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-purple-500" />
              <span>Zero-Tracking Privacy</span>
            </span>
          </div>
        </div>

        {/* Interactive App Workspace Mockup */}
        <div className="relative mt-12 sm:mt-16 mx-auto max-w-6xl">
          {/* Subtle Ambient Backing Glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-cyan-500/30 blur-xl opacity-70 -z-10" />

          {/* Floating interactive badge cards */}
          <div className="hidden lg:flex absolute -top-6 -left-6 z-20 items-center gap-3 rounded-2xl border border-emerald-500/30 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-xl animate-float-slow">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">Zero-Knowledge Vault</div>
              <div className="text-[11px] text-muted-foreground">19 Secrets safely encrypted</div>
            </div>
          </div>

          <div className="hidden lg:flex absolute -bottom-6 -right-6 z-20 items-center gap-3 rounded-2xl border border-cyan-500/30 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-xl animate-float-reverse">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-500">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-foreground">PDF OCR Search</div>
              <div className="text-[11px] text-muted-foreground">System_Spec.pdf • 48 pages indexed</div>
            </div>
          </div>

          {/* Main App Container */}
          <div className="rounded-2xl sm:rounded-3xl border border-border/80 bg-background/95 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* macOS Chrome Header Bar */}
            <div className="flex items-center justify-between border-b border-border/70 bg-muted/30 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 hidden sm:inline-block text-xs font-medium text-muted-foreground">
                  NoteVault Workspace — Personal Hub
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline font-mono">Vault Status: Locked & Synced</span>
              </div>
            </div>

            {/* App Body Grid (Sidebar + Main Editor + Vault Drawer) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
              {/* Left App Sidebar (Mockup) */}
              <div className="hidden md:block lg:col-span-3 border-r border-border/60 bg-muted/20 p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Workspace
                  </span>
                  <span className="text-[10px] font-mono rounded bg-primary/10 px-1.5 py-0.5 text-primary">
                    Pro
                  </span>
                </div>

                <nav className="space-y-1 text-xs font-medium">
                  <div className="flex items-center justify-between rounded-lg bg-indigo-500/15 px-3 py-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                    <span className="flex items-center gap-2.5">
                      <FileText className="h-3.5 w-3.5" />
                      <span>Knowledge Notes</span>
                    </span>
                    <span className="text-[11px] opacity-75">148</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/50 transition-colors">
                    <span className="flex items-center gap-2.5">
                      <FileUp className="h-3.5 w-3.5 text-cyan-500" />
                      <span>PDFs & Documents</span>
                    </span>
                    <span className="text-[11px] opacity-75">32</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/50 transition-colors">
                    <span className="flex items-center gap-2.5">
                      <FolderKanban className="h-3.5 w-3.5 text-violet-500" />
                      <span>Projects & Sprints</span>
                    </span>
                    <span className="text-[11px] opacity-75">8</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/50 transition-colors">
                    <span className="flex items-center gap-2.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Encrypted Vault</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                      19
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted/50 transition-colors">
                    <span className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                      <span>Task Inbox</span>
                    </span>
                    <span className="text-[11px] opacity-75">14</span>
                  </div>
                </nav>

                {/* Quick Tags List */}
                <div className="pt-2 border-t border-border/40">
                  <div className="text-[11px] font-semibold text-muted-foreground mb-2">
                    Active Knowledge Tags
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-background px-2 py-0.5 text-[10px] text-muted-foreground border border-border/60">
                      #architecture
                    </span>
                    <span className="rounded-md bg-background px-2 py-0.5 text-[10px] text-muted-foreground border border-border/60">
                      #security
                    </span>
                    <span className="rounded-md bg-background px-2 py-0.5 text-[10px] text-muted-foreground border border-border/60">
                      #ai-models
                    </span>
                    <span className="rounded-md bg-background px-2 py-0.5 text-[10px] text-muted-foreground border border-border/60">
                      #specs
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Content Pane (Interactive Note & Tasks) */}
              <div className="lg:col-span-6 p-5 sm:p-6 space-y-5">
                {/* Document Breadcrumbs & Tags */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Engineering</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="font-semibold text-foreground">
                      Distributed_Architecture_v2.md
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Saved Local & Cloud
                    </span>
                  </div>
                </div>

                {/* Note Title */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    System Architecture & Encrypted Storage Design
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Updated today • 1,420 words • 4 linked documents • 2 secrets attached
                  </p>
                </div>

                {/* Embedded Code Snippet */}
                <div className="rounded-xl border border-border/70 bg-muted/40 p-3 sm:p-4 font-mono text-[11px] sm:text-xs">
                  <div className="flex items-center justify-between text-muted-foreground border-b border-border/40 pb-2 mb-2">
                    <span className="flex items-center gap-1.5 text-primary">
                      <FileCode className="h-3.5 w-3.5" />
                      <span>crypto-vault-client.ts</span>
                    </span>
                    <span className="text-[10px] text-emerald-500 font-medium">AES-256-GCM Verified</span>
                  </div>
                  <pre className="text-muted-foreground overflow-x-auto leading-relaxed">
                    <code>
                      <span className="text-violet-500 font-semibold">async function</span>{" "}
                      <span className="text-blue-500">unlockVaultSecret</span>(id: string) &#123;{"\n"}
                      {"  "}const key = <span className="text-violet-500">await</span> deriveMasterKey(passphrase);{"\n"}
                      {"  "}return clientDecrypt(vaultStore[id], key);{"\n"}
                      &#125;
                    </code>
                  </pre>
                </div>

                {/* Interactive Task Checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">
                      Sprint Deliverables (Interactive — Click to toggle)
                    </span>
                    <span className="text-[11px] text-indigo-500 font-medium">
                      {tasks.filter((t) => t.completed).length} of {tasks.length} done
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {tasks.map((task) => (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
                          task.completed
                            ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground line-through"
                            : "border-border/60 bg-background hover:bg-muted/50 text-foreground"
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="flex-1">{task.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Document Attachment Widget */}
                <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-500">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        Microservices_Architecture_Spec.pdf
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        3.2 MB • 42 Pages • OCR Indexed with Highlights
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">
                    Preview
                  </span>
                </div>
              </div>

              {/* Right Panel: Encrypted Secrets Vault Widget (Mockup) */}
              <div className="lg:col-span-3 border-t lg:border-t-0 lg:border-l border-border/60 bg-muted/15 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Secrets Vault</span>
                  </div>
                  <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    Encrypted
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-normal">
                  Your credentials and API keys are protected client-side with zero-knowledge
                  hashing.
                </p>

                {/* Interactive Secret Demo Box */}
                <div className="rounded-xl border border-border/80 bg-background p-3.5 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
                      <KeyRound className="h-3 w-3 text-amber-500" />
                      <span>OPENAI_PROD_API_KEY</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSecretRevealed(!secretRevealed)}
                      className="text-muted-foreground hover:text-foreground text-[10px] flex items-center gap-1"
                    >
                      {secretRevealed ? (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Peek</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-muted/60 px-2.5 py-1.5 font-mono text-[11px]">
                    <span className="text-foreground tracking-wider select-all">
                      {secretRevealed ? "sk-nv-994x88219fa8bc3" : "••••••••••••••••••••"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopySecret}
                      className="text-muted-foreground hover:text-primary transition-colors ml-2"
                      title="Copy Secret"
                    >
                      {copiedSecret ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    <span>Client decrypt: 0ms (In Memory)</span>
                  </div>
                </div>

                {/* Vault Health Stats */}
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-foreground">
                    Workspace Statistics
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Active Projects</span>
                    <span className="font-semibold text-foreground">6 Active</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Indexed PDF Pages</span>
                    <span className="font-semibold text-foreground">340 Pages</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>Encrypted Secrets</span>
                    <span className="font-semibold text-emerald-500">19 Keys</span>
                  </div>
                </div>

                {/* Quick CTA */}
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold rounded-lg hover:border-indigo-500/50 hover:bg-indigo-500/10"
                    >
                      Lock Your Vault Free
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;