"use server";

import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function bookmarkArticle(articleId: string, userId: string) {

    try {
    const existing = await prisma.bookmark.findFirst({
      where: { articleId, userId },
    });

    if (existing) {
      // If already bookmarked → remove it (toggle)
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return { success: true, bookmarked: false };
    }

    // Otherwise create a bookmark
    await prisma.bookmark.create({
      data: { articleId, userId },
    });
    revalidatePath(`/articles/${articleId}`);
    return { success: true, bookmarked: true };
  } catch (err) {
    console.error("Error bookmarking article:", err);
    return { success: false, error: "Failed to bookmark" };
  }
}