"use server";

import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function bookmarkArticle(articleId: string, userId: string) {

    try {
    const existing = await prisma.bookmark.findUnique({
        where: {
            userId_articleId: {
                userId,
                articleId,
            },
        },
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      });
      return { status: "removed" };
    } else {
      await prisma.bookmark.create({
        data: {
          articleId,
          userId,
        },
      });
      return { status: "added" };
    }
  } catch (error) {
    console.error("Bookmark error:", error);
    throw new Error("Failed to bookmark");
  }
}