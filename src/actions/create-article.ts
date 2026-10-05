"use server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { countWords } from "@/lib/utils";

const createArticleSchema = z.object({
  title: z.string().min(1, "Title is required").max(150),
  content: z.string().min(1, "Content is required").refine((val) => countWords(val) <= 10000, {
    message: "Content cannot exceed 10000 words",
  }),
  parentId: z.string().optional().nullable(),
});

export type CreateArticlesFormState = {
  errors: {
    title?: string[];
    content?: string[];
    formErrors?: string[];
  };
  createdNoteId?: string;
  parentId?: string | null;
};

export const createArticle = async (
  prevState: CreateArticlesFormState,
  formData: FormData
): Promise<CreateArticlesFormState & { success?: boolean }> => {
  const parentIdRaw = formData.get("parentId") as string | null;
  const parentId = parentIdRaw && parentIdRaw.trim() !== "" ? parentIdRaw.trim() : null;

  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    parentId,
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
        formErrors: ["You must be logged in to create a note."],
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!existingUser) {
    return {
      errors: {
        formErrors: ["User not found."],
      },
    };
  }

  try {
    const createdNote = await prisma.article.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        parentId: result.data.parentId || null,
        authorId: existingUser.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/notes");
    if (createdNote.parentId) {
      revalidatePath(`/dashboard/notes/${createdNote.parentId}`);
    }
    return { errors: {}, success: true, createdNoteId: createdNote.id, parentId: createdNote.parentId };
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
          formErrors: ["Some internal server error occurred."],
        },
      };
    }
  }
};
