import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { FileText, Plus, Search, Tag, Calendar, Lock } from "lucide-react";
import RecentNotes from "@/components/dashboard/recent-notes";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge Notes | NoteVault",
  description: "View and manage all your rich markdown knowledge notes and documentation.",
};

export default async function NotesPage() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-bold mb-2">Please sign in</h2>
        <p className="text-muted-foreground text-sm">
          Sign in to access your private knowledge notes.
        </p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  const notes = dbUser
    ? await prisma.article.findMany({
        where: { authorId: dbUser.id },
        orderBy: { createdAt: "desc" },
        include: {
          comments: true,
          author: {
            select: {
              name: true,
              email: true,
              imageUrl: true,
            },
          },
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            Knowledge Notes
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Capture, search, and interlink your personal engineering notes and specs.
          </p>
        </div>

        <Link href="/dashboard/notes/create">
          <Button className="h-9 gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
            <span>Create New Note</span>
          </Button>
        </Link>
      </div>

      <RecentNotes notes={notes} />
    </div>
  );
}
