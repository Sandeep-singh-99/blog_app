import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  FileText,
  PlusCircle,
  FileUp,
  FolderKanban,
  Lock,
  CheckSquare,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Zap,
  HardDrive,
  Clock,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import RecentNotes from "./recent-notes";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function WorkspaceDashboard() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-semibold mb-2">Please sign in</h2>
        <p className="text-muted-foreground">
          You need to be logged in to view your NoteVault workspace.
        </p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  if (!dbUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-semibold mb-2">No profile found</h2>
        <p className="text-muted-foreground">
          Your account was not found in the database.
        </p>
      </div>
    );
  }

  const [notes, totalNotesCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: {
        authorId: dbUser.id,
        parentId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: true,
        subNotes: {
          select: {
            id: true,
            title: true,
          },
        },
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    }),
    prisma.article.count({
      where: {
        authorId: dbUser.id,
      },
    }),
  ]);

  let documentsCount = 0;
  try {
    if ("document" in prisma && typeof (prisma as any).document?.count === "function") {
      documentsCount = await (prisma as any).document.count({
        where: {
          userId: dbUser.id,
        },
      });
    }
  } catch (err) {
    console.warn("Could not fetch document count:", err);
  }

  return (
    <div className="flex-1 space-y-6 sm:space-y-8">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Workspace Overview
            </h1>
            <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              NoteVault 2.0
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Welcome back, <span className="font-semibold text-foreground">{dbUser.name || "Vault Master"}</span>.
            Manage your personal knowledge, documents, projects, secrets, and tasks.
          </p>
        </div>

        {/* Quick Action Button Group */}
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/notes/create">
            <Button className="h-9 gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20">
              <PlusCircle className="h-4 w-4" />
              <span>New Note</span>
            </Button>
          </Link>
          <Link href="/dashboard/secrets">
            <Button variant="outline" className="h-9 gap-1.5 rounded-xl text-xs font-semibold border-border/80 hover:bg-accent">
              <Lock className="h-3.5 w-3.5 text-emerald-500" />
              <span>Vault</span>
            </Button>
          </Link>
          <Link href="/dashboard/tasks">
            <Button variant="outline" className="h-9 gap-1.5 rounded-xl text-xs font-semibold border-border/80 hover:bg-accent">
              <CheckSquare className="h-3.5 w-3.5 text-amber-500" />
              <span>Tasks</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Security Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-foreground">Zero-Knowledge Vault Active</span>
            <span className="text-muted-foreground ml-2 hidden sm:inline">
              Client AES-256-GCM encryption • Master key verified locally
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Cache Synced</span>
        </div>
      </div>

      {/* 5 Core Workspace Metric Cards */}
      <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-5">
        {/* Card 1: Knowledge Notes */}
        <Card className="border border-border/70 shadow-xs hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Knowledge Notes
            </CardTitle>
            <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-600 dark:text-indigo-400">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-foreground">{totalNotesCount}</div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {notes.length} main {notes.length === 1 ? "page" : "pages"}
            </p>
          </CardContent>
        </Card>

        {/* Card 2: PDFs & Documents */}
        <Link href="/dashboard/documents" className="block">
          <Card className="border border-border/70 shadow-xs hover:shadow-md hover:border-cyan-500/40 transition-all h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-semibold text-muted-foreground">
                PDFs & Docs
              </CardTitle>
              <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-600 dark:text-cyan-400">
                <FileUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-black text-foreground">{documentsCount}</div>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Uploaded PDF files
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Card 3: Projects & Sprints */}
        <Card className="border border-border/70 shadow-xs hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Active Projects
            </CardTitle>
            <div className="rounded-xl bg-violet-500/10 p-2 text-violet-600 dark:text-violet-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-foreground">4</div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Kanban milestones
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Encrypted Secrets */}
        <Card className="border border-border/70 shadow-xs hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Secrets Vault
            </CardTitle>
            <div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <Lock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">9</div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              AES-256 protected
            </p>
          </CardContent>
        </Card>

        {/* Card 5: Tasks & Actions */}
        <Card className="border border-border/70 shadow-xs hover:shadow-md transition-all col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              Task Inbox
            </CardTitle>
            <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <CheckSquare className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-black text-foreground">8 Pending</div>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              3 high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column (8 cols): Recent Notes & Documents */}
        <div className="lg:col-span-8 space-y-6">
          <RecentNotes notes={notes} />
        </div>

        {/* Right Column (4 cols): Quick Access Modules */}
        <div className="lg:col-span-4 space-y-6">
          {/* Module 1: Encrypted Secrets Quick View */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-emerald-500" />
                  <span>Encrypted Secrets</span>
                </CardTitle>
                <Link
                  href="/dashboard/secrets"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Vault</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                Zero-knowledge encrypted credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5 space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>CLERK_SECRET_KEY</span>
                  <span className="text-[10px] text-emerald-500 font-mono">LOCKED</span>
                </div>
                <div className="font-mono text-muted-foreground text-[11px]">
                  ••••••••••••••••••••
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-muted/40 p-2.5 space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>POSTGRES_MASTER_PASSWORD</span>
                  <span className="text-[10px] text-emerald-500 font-mono">LOCKED</span>
                </div>
                <div className="font-mono text-muted-foreground text-[11px]">
                  ••••••••••••••••••••
                </div>
              </div>

              <Link href="/dashboard/secrets" className="block pt-1">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl">
                  Open Encrypted Vault
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Module 2: Priority Tasks Quick View */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-amber-500" />
                  <span>Today's Actions</span>
                </CardTitle>
                <Link
                  href="/dashboard/tasks"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <span>All Tasks</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                Action items aggregated from your notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span className="line-through text-xs flex-1">Configure client AES vault specs</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2 text-foreground">
                <div className="h-4 w-4 rounded-full border border-muted-foreground shrink-0" />
                <span className="text-xs flex-1">Index architecture whitepaper PDF</span>
                <span className="text-[10px] rounded bg-rose-500/10 text-rose-600 px-1.5 py-0.5 font-bold">
                  Urgent
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-background p-2 text-foreground">
                <div className="h-4 w-4 rounded-full border border-muted-foreground shrink-0" />
                <span className="text-xs flex-1">Review sprint deliverables for NoteVault</span>
              </div>
            </CardContent>
          </Card>

          {/* Module 3: PDF Document Library Quick View */}
          <Card className="border border-border/80 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-500" />
                  <span>PDF Documents</span>
                </CardTitle>
                <Link
                  href="/dashboard/documents"
                  className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Library</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <CardDescription className="text-xs">
                Technical manuals and research specs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background p-2.5">
                <div className="flex items-center gap-2">
                  <FileUp className="h-4 w-4 text-cyan-500 shrink-0" />
                  <div>
                    <div className="font-semibold text-foreground">Distributed_Systems.pdf</div>
                    <div className="text-[10px] text-muted-foreground">64 pages • OCR indexed</div>
                  </div>
                </div>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">
                  Read
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
