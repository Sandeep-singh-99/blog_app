"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function followUser(targetUserId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to follow users.");
  }

  // Find the current user in the database
  const currentUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!currentUser) {
    throw new Error("User not found in database.");
  }

  // Prevent self-follow
  if (currentUser.id === targetUserId) {
    throw new Error("You cannot follow yourself.");
  }

  // Check if already following
  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    // If already following → unfollow
    await prisma.follow.delete({
      where: { id: existingFollow.id },
    });
    revalidatePath(`/profile/${targetUserId}`);
    revalidatePath(`/profile/${currentUser.id}`);
    return {
      success: true,
      message: "Unfollowed successfully",
      followed: false,
    };
  } else {
    // Otherwise → follow
    await prisma.follow.create({
      data: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    });

    revalidatePath(`/profile/${targetUserId}`);
    revalidatePath(`/profile/${currentUser.id}`);
    return {
      success: true,
      message: existingFollow
        ? "Unfollowed successfully"
        : "Followed successfully",
      followed: !existingFollow,
    };
  }
}
