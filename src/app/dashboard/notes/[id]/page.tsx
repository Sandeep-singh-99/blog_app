import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditorClientPreview from "@/components/Editor/EditorClientPreview";
import DeleteBtn from "@/components/dashboard/delete-btn";
import {
  ArrowLeft,
  Edit3,
  Lock,
  Calendar,
  Tag,
  Copy,
  FileText,
  Clock,
  Share2,
} from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const note = await prisma.article.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: note ? `${note.title} | NoteVault` : "View Note | NoteVault",
    description: "Read and manage personal knowledge note in NoteVault.",
  };
}

export default async function ViewNotePage({ params }: Props) {
  const { id } = await params;
  const authUser = await currentUser();

  if (!authUser) {
    redirect("/sign-in");
  }

  const note = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-bold mb-2">Note Not Found</h2>
        <p className="text-muted-foreground text-sm mb-4">
          This knowledge note may have been deleted or moved.
        </p>
        <Link href="/dashboard/notes">
          <Button variant="outline">Back to Notes</Button>
        </Link>
      </div>
    );
  }

  // Calculate approximate word count & reading time
  const plainText = note.content.replace(/<[^>]*>/g, "").trim();
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <Link
          href="/dashboard/notes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href={`/dashboard/notes/${note.id}/edit`}>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs rounded-xl">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Note</span>
            </Button>
          </Link>

          <DeleteBtn articleId={note.id} />
        </div>
      </div>

      {/* Note Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="secondary"
            className="rounded-md font-mono text-xs bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase"
          >
            {note.category || "General"}
          </Badge>

          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Lock className="h-3 w-3" />
            <span>Private Note</span>
          </span>

          <span className="text-xs text-muted-foreground font-mono">
            {wordCount} words • {readTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          {note.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-b border-border/40 pb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Updated on{" "}
              {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </span>

          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {note.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded bg-muted px-1.5 py-0.2 text-[11px] font-mono text-muted-foreground"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Note Content Viewer (Fixed Size Scroll View) */}
      <div className="h-[550px] sm:h-[750px] overflow-y-auto overscroll-contain rounded-2xl border border-border/80 bg-card p-6 sm:p-10 shadow-xs scroll-smooth">
        <EditorClientPreview content={note.content} />
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-border/50 pt-6 text-xs text-muted-foreground">
        <span>Part of your NoteVault Personal Knowledge Base</span>
        <Link href="/dashboard/notes" className="text-primary font-semibold hover:underline">
          View all notes →
        </Link>
      </div>
    </div>
  );
}
