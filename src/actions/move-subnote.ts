"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Promotes a subnote to become a top-level main page (like OneNote's "Promote Subpage")
 */
export async function promoteSubNote(noteId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const note = await prisma.article.findUnique({
      where: { id: noteId },
    });
    if (!note || note.authorId !== user.id) {
      return { success: false, error: "Note not found or permission denied" };
    }

    await prisma.article.update({
      where: { id: noteId },
      data: { parentId: null },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    revalidatePath(`/dashboard/notes/${noteId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to promote subnote:", error);
    return { success: false, error: "Failed to promote subpage" };
  }
}

/**
 * Makes a note a subpage of another parent note (like OneNote's "Make Subpage")
 */
export async function demoteToSubNote(noteId: string, parentId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (noteId === parentId) {
      return { success: false, error: "A note cannot be a subpage of itself" };
    }

    const [note, parentNote] = await Promise.all([
      prisma.article.findUnique({ where: { id: noteId } }),
      prisma.article.findUnique({ where: { id: parentId } }),
    ]);

    if (!note || note.authorId !== user.id || !parentNote || parentNote.authorId !== user.id) {
      return { success: false, error: "Notes not found or permission denied" };
    }

    await prisma.article.update({
      where: { id: noteId },
      data: { parentId: parentId },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    revalidatePath(`/dashboard/notes/${noteId}`);
    revalidatePath(`/dashboard/notes/${parentId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to make subpage:", error);
    return { success: false, error: "Failed to demote to subpage" };
  }
}
