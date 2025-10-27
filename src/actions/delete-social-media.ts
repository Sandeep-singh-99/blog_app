"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteSocialMedia(id: string) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, message: "You must be logged in to delete social media links." };
  }

  // Find the logged-in user in the DB
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    return { success: false, message: "User not found." };
  }

  try {
    // Verify ownership before deletion
    const link = await prisma.socialLink.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!link || link.userId !== user.id) {
      return { success: false, message: "You are not authorized to delete this link." };
    }

    // Delete the social media link
    await prisma.socialLink.delete({
      where: { id },
    });

    // Revalidate the profile page (both main and dynamic user page)
    revalidatePath(`/profile/${user.id}`);
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error("❌ Error deleting social media link:", error);
    return { success: false, message: "Failed to delete social media link." };
  }
}
