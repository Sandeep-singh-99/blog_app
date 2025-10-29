"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function bookmarkArticle(articleId: string, userId: string) {
  try {
    const existing = await prisma.bookmark.findFirst({
      where: { articleId, userId },
    });

    if (existing) {
      await prisma.bookmark.delete({ where: { id: existing.id } });
      revalidatePath(`/articles/${articleId}`);
      return { success: true, bookmarked: false };
    }

    await prisma.bookmark.create({ data: { articleId, userId } });
    revalidatePath(`/articles/${articleId}`);
    return { success: true, bookmarked: true };
  } catch (err) {
    console.error("Error bookmarking article:", err);
    return { success: false, error: "Failed to bookmark" };
  }
}
