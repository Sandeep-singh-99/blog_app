"use server"

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCommentSchema = z.object({
    comment: z.string().min(1, "Comment cannot be empty"),
})

type createCommentFormState = {
    errors: {
        comment?: string[]
        formError?: string[]
    }
}

export const createComment = async ( articleId: string, prevState: createCommentFormState, formData: FormData): Promise<createCommentFormState> => {
    const result = createCommentSchema.safeParse({ comment: formData.get("comment") });

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    const { userId } = await auth();

    if (!userId) {
        return {
            errors: {
                formError: ["You must be logged in to comment"]
            }
        }
    }

    const existingUser = await prisma.user.findUnique({ where: { clerkUserId: userId }})

    if (!existingUser) {
        return {
            errors: {
                formError: ["User not found. Please try logging in again."]
            }
        }
    }


    try {
        await prisma.comment.create({
            data: {
                content: result.data.comment,
                articleId,
                userId: existingUser.id
            }
        })
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                errors: {
                    formError: [error.message]
                }
            }
        } else {
            return {
                errors: {
                    formError: ["An unexpected error occurred while creating the comment"]
                }
            }
        }
    }

    revalidatePath(`/articles/${articleId}`);
    return {
        errors: {}
    }
}