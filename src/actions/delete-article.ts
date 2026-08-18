"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const deleteArticle = async (articleId: string) => {
    const { userId } = await auth();
    if (!userId) return;

    const user = await prisma.user.findUnique({
        where: { clerkUserId: userId },
    });
    if (!user) return;

    const article = await prisma.article.findUnique({
        where: { id: articleId },
    });

    if (!article || article.authorId !== user.id) return;

    // Delete all comments associated with the article
    await prisma.comment.deleteMany({
        where: {
            articleId: articleId,
        },
    });

    // Delete the article
    await prisma.article.delete({
        where: {
            id: articleId,
        },
    });

    revalidatePath("/dashboard");
};