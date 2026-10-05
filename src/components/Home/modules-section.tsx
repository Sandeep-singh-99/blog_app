"use client";

import React, { useState } from "react";
import {
  FileText,
  FileUp,
  FolderKanban,
  Lock,
  CheckSquare,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Key,
  BookOpen,
  Cpu,
  Clock,
  Compass,
} from "lucide-react";

export function ModulesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const modules = [
    {
      id: "notes",
      icon: FileText,
      color: "text-indigo-500",
      bgGlow: "from-indigo-500/20 to-purple-500/10",
      borderGlow: "group-hover:border-indigo-500/50",
      badge: "Markdown & Rich-Text",
      title: "Personal Knowledge & Notes",
      description:
        "Capture complex engineering thoughts, architecture decisions, code snippets, and research notes with markdown speed and bidirectional links.",
      features: [
        "Bidirectional backlinking to create your personal knowledge web",
        "Full syntax highlighting for 50+ programming languages",
        "Mathematical formula support (KaTeX) & custom callouts",
        "Fast tagging and hierarchical folder categorization",
      ],
      previewSnippet: {
        tag: "#engineering/architecture",
        title: "Distributed Cache Coherence",
        lines: [
          "• Invalidation vs write-through strategy trade-offs",
          "• Redis Cluster sharding key collision mitigation",
          "• [[Database Replication]] & [[Raft Consensus]]",
        ],
      },
    },
    {
      id: "pdfs",
      icon: FileUp,
      color: "text-cyan-500",
      bgGlow: "from-cyan-500/20 to-blue-500/10",
      borderGlow: "group-hover:border-cyan-500/50",
      badge: "Document Library",
      title: "PDFs & Technical Documents",
      description:
        "Upload, read, and index your research whitepapers, architecture specs, and book highlights directly alongside your written notes.",
      features: [
        "In-browser fast PDF viewer with dual-pane note taking",
        "Instant OCR full-text search across all uploaded pages",
        "Highlight text and automatically quote snippets into your active note",
        "Support for PDFs, Markdown, Docs, and technical assets",
      ],
      previewSnippet: {
        tag: "System_Whitepaper_v2.pdf",
        title: "Deep Optical OCR Analysis",
        lines: [
          "• Page 14: Latency benchmarks under 100k req/s",
          "• Highlight saved to note: 'Zero-copy memory allocations'",
          "• 42 pages indexed with full vector queryability",
        ],
      },
    },
    {
      id: "projects",
      icon: FolderKanban,
      color: "text-violet-500",
      bgGlow: "from-violet-500/20 to-pink-500/10",
      borderGlow: "group-hover:border-violet-500/50",
      badge: "Project Management",
      title: "Agile Projects & Kanban Sprints",
      description:
        "Transform vague concepts into shipped software. Organize projects with interactive Kanban boards, milestone roadmaps, and sprint deliverables.",
      features: [
        "Visual drag-and-drop Kanban columns (Backlog, In Progress, Review, Shipped)",
        "Link project milestones directly to meeting notes and specs",
        "Timeline progress indicators and velocity metrics",
        "Customizable tags, deadline warnings, and priorities",
      ],
      previewSnippet: {
        tag: "Sprint 14: Q4 Launch",
        title: "Active Deliverables (84% Done)",
        lines: [
          "✓ Production DB Migration script audited",
          "✓ Multi-tenant Clerk Auth flow verified",
          "⏳ Final security penetration review (In Progress)",
        ],
      },
    },
    {
      id: "vault",
      icon: Lock,
      color: "text-emerald-500",
      bgGlow: "from-emerald-500/20 to-teal-500/10",
      borderGlow: "group-hover:border-emerald-500/50",
      badge: "Zero-Knowledge Encryption",
      title: "Encrypted Secrets & Credentials",
      description:
        "Safeguard your most critical API keys, database credentials, recovery seeds, and confidential notes behind client-side AES-256 GCM encryption.",
      features: [
        "Master passphrase never transmitted or saved on any server",
        "One-click copy to clipboard with auto-clear memory security",
        "Granular categories: API keys, Passwords, SSH keys, Private seeds",
        "Zero-knowledge architecture guarantee",
      ],
      previewSnippet: {
        tag: "AES-256-GCM Locked",
        title: "Client-Side Cryptography",
        lines: [
          "• CLOUD_AWS_KEY: ••••••••••••••• [Copied to clipboard]",
          "• SUPABASE_SERVICE_ROLE: ••••••••••••••• [Encrypted]",
          "• Master Pin: Verified via Argon2 memory-hard hash",
        ],
      },
    },
    {
      id: "tasks",
      icon: CheckSquare,
      color: "text-amber-500",
      bgGlow: "from-amber-500/20 to-orange-500/10",
      borderGlow: "group-hover:border-amber-500/50",
      badge: "Action Management",
      title: "Unified Tasks & Action Inbox",
      description:
        "Never lose a todo again. Checkboxes inside your notes automatically aggregate into your master task inbox, complete with filters and due dates.",
      features: [
        "Inline note tasks sync instantaneously to your global to-do manager",
        "Priority tags (Urgent, High, Medium, Low) and deadline alerts",
        "Focus mode to crush one task at a time with zero distractions",
        "Recurring checklist templates for daily routines and releases",
      ],
      previewSnippet: {
        tag: "Today's Focus: 6 Tasks",
        title: "High Priority Actions",
        lines: [
          "✓ Review pull request #142 (Merged)",
          "✓ Read Chapter 4 of Database Internals PDF",
          "⏳ Rotate GitHub Personal Access Token (Urgent)",
        ],
      },
    },
    {
      id: "search",
      icon: Search,
      color: "text-rose-500",
      bgGlow: "from-rose-500/20 to-red-500/10",
      borderGlow: "group-hover:border-rose-500/50",
      badge: "Lightning Index",
      title: "Command-K Instant Search",
      description:
        "Locate any thought, PDF page, project task, or secret in less than 10 milliseconds. Fuzzy matching and full-content search right at your fingertips.",
      features: [
        "Global keyboard shortcut (⌘K / Ctrl+K) accessible anywhere",
        "Fuzzy search queries titles, bodies, tags, and PDF text simultaneously",
        "Recent history & pinned bookmarks for instant jump-back",
        "Zero-latency local cache ensures offline responsiveness",
      ],
      previewSnippet: {
        tag: "Search Query: 'consensus'",
        title: "4 Results Found in 3ms",
        lines: [
          "1. Note: Raft Consensus Algorithm in Go (Match in body)",
          "2. PDF: Distributed_Systems_Book.pdf (Page 89)",
          "3. Project: Consensus Engine v1 (Milestone 2)",
        ],
      },
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 relative bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Layers className="h-3.5 w-3.5" />
            <span>The Six Pillars of NoteVault</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Everything Your Mind Needs.{" "}
            <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
              Unified in One Vault.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Eliminate cognitive overload. Manage your notes, research papers, project
            sprints, credentials, and tasks without ever switching browser tabs.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className={`group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${m.borderGlow}`}
              >
                {/* Background Ambient Glow */}
                <div
                  className={`absolute inset-0 -z-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${m.bgGlow} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="space-y-4">
                  {/* Badge & Icon Header */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 border border-border/60 ${m.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-[11px] font-semibold text-muted-foreground">
                      {m.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Feature Checkpoints */}
                  <ul className="space-y-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    {m.features.slice(0, 3).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <span className="mt-1 flex h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Micro Visual Card Snippet */}
                <div className="mt-6 rounded-xl border border-border/60 bg-muted/30 p-3 font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground border-b border-border/40 pb-1.5 text-[10px]">
                    <span className="truncate max-w-[170px] text-primary font-semibold">
                      {m.previewSnippet.tag}
                    </span>
                    <span className="text-emerald-500 font-bold">Active</span>
                  </div>
                  <div className="font-semibold text-foreground text-[11px] pt-1">
                    {m.previewSnippet.title}
                  </div>
                  {m.previewSnippet.lines.map((line, lIdx) => (
                    <div key={lIdx} className="text-muted-foreground text-[10px] truncate">
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
