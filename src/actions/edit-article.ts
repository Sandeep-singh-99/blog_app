"use server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { countWords } from "@/lib/utils";

const editArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().min(1, "Content is required").refine((val) => countWords(val) <= 10000, {
    message: "Content cannot exceed 10000 words",
  }),
});

export type EditArticlesFormState = {
  errors: {
    title?: string[];
    content?: string[];
    formErrors?: string[];
  };
  success?: boolean;
  updatedNoteId?: string;
};

export const editArticle = async (
  articleId: string,
  prevState: EditArticlesFormState,
  formData: FormData
): Promise<EditArticlesFormState> => {
  const result = editArticleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You must be logged in to edit this note."],
      },
    };
  }

  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    return {
      errors: {
        formErrors: ["Note not found."],
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!existingUser || existingUser.id !== existingArticle.authorId) {
    return {
      errors: {
        formErrors: ["Access denied."],
      },
    };
  }

  try {
    const updated = await prisma.article.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        content: result.data.content,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    revalidatePath(`/dashboard/notes/${articleId}`);
    if (existingArticle.parentId) {
      revalidatePath(`/dashboard/notes/${existingArticle.parentId}`);
    }

    return {
      errors: {},
      success: true,
      updatedNoteId: updated.id,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["An error occurred while updating the note."],
        },
      };
    }
  }
};
