"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const socialLinkSchema = z.object({
  socialMediaName: z.string().min(1, "Please select a social media."),
  url: z.string().url("Please enter a valid URL."),
});

export type CreateSocialLinkFormState = {
  errors: {
    socialMediaName?: string[];
    url?: string[];
    formErrors?: string[];
  };
  success?: boolean;
};

export const createSocialLink = async (
  prevState: CreateSocialLinkFormState,
  formData: FormData
): Promise<CreateSocialLinkFormState> => {
  const result = socialLinkSchema.safeParse({
    socialMediaName: formData.get("socialMediaName"),
    url: formData.get("url"),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      errors: { formErrors: ["You must be logged in to add social links."] },
    };
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return {
      errors: { formErrors: ["User not found."] },
    };
  }

  try {
    // Check if link for that platform already exists
    const existingLink = await prisma.socialLink.findFirst({
      where: {
        userId: user.id,
        socialMediaName: result.data.socialMediaName,
      },
    });

    if (existingLink) {
      // Update existing social link
      await prisma.socialLink.update({
        where: { id: existingLink.id },
        data: { url: result.data.url },
      });
    } else {
      // Create new social link
      await prisma.socialLink.create({
        data: {
          userId: user.id,
          socialMediaName: result.data.socialMediaName,
          url: result.data.url,
        },
      });
    }
  } catch (error) {
    console.error("Error saving social link:", error);
    return { errors: { formErrors: ["Failed to save social link."] } };
  }

  revalidatePath(`/profile/${user.id}`);
  return { success: true, errors: {} };
};
