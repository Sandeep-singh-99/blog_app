import EditArticle from "@/components/articles/edit-article";
import { prisma } from "@/lib/prisma";
import React from "react";
import type { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

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
    title: note ? `Edit: ${note.title} | NoteVault` : "Edit Note | NoteVault",
    description: "Update your note title, markdown content, tags, and topics.",
  };
}

export default async function EditNotePage({ params }: Props) {
  const { id } = await params;
  const authUser = await currentUser();

  if (!authUser) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  const note = await prisma.article.findUnique({
    where: { id },
    include: {
      parent: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!note || note.authorId !== dbUser?.id) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Note not found or access denied.</h2>
      </div>
    );
  }

  return (
    <div>
      <EditArticle article={note} />
    </div>
  );
}
