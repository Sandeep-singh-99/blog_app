"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { countWords } from "@/lib/utils";

const createBioSchema = z.object({
    bio: z.string().refine((val) => countWords(val) <= 1500, {
        message: "Bio cannot exceed 1500 words",
    }),
})

export type CreateBioFormState = {
    errors: {
        bio?: string[];
        formErrors?: string[];
    };
};

export const createBio = async (prevState: CreateBioFormState, formData: FormData): Promise<CreateBioFormState & { success?: boolean}> => {
    const result = createBioSchema.safeParse({
        bio: formData.get("bio"),
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
                formErrors: ["You must be logged in to update your bio."],
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
        await prisma.user.update({
            where: { clerkUserId: userId },
            data: {
                bio: result.data.bio,
            },
        })
    } catch (error) {
        return {
            errors: {
                formErrors: ["Failed to update bio."],
            },
        };
    }

    revalidatePath(`/profile`);
    redirect(`/profile`);
}