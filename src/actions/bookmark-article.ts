"use server";

import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function bookmarkArticle(articleId: string, userId: string) {

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    })

    if (!user) {
        throw new Error("User does not exist in the database.");
    }

    const existingBookmark = await prisma.bookmark.findFirst({
        where: { articleId, userId: user.id },
    });

    if (existingBookmark) {
        await prisma.bookmark.delete({
            where: { id: existingBookmark.id },
        })
    } else {
        await prisma.bookmark.create({
            data: {
                articleId,
                userId: user.id,
            },
        })
    }

    revalidatePath(`/article/${articleId}`);
}