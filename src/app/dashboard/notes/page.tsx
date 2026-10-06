import React from "react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth-user";
import RecentNotes from "@/components/dashboard/recent-notes";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Knowledge Notes | NoteVault",
  description: "View and manage all your rich markdown knowledge notes and documentation.",
};

export default async function NotesPage() {
  const dbUser = await getAuthenticatedUser();

  const notes = await prisma.article.findMany({
        where: {
          authorId: dbUser.id,
          parentId: null,
        },
        orderBy: { createdAt: "desc" },
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
      });

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
      </div>

      <RecentNotes notes={notes} />
    </div>
  );
}
