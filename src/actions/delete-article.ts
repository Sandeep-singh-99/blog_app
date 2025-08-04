"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteArticle = async (articleId: string) => {
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