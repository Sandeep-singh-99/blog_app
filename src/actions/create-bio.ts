"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const createBioSchema = z.object({
    bio: z.string().max(500),
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

    revalidatePath(`/profile/${existingUser.id}`);
    redirect(`/profile/${existingUser.id}`);
}