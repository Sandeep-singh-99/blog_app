import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getAuthenticatedUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // 1. Check if user already exists in PostgreSQL
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  // 2. If user exists in Clerk but not yet in PostgreSQL, automatically create/sync them
  if (!dbUser) {
    try {
      const clerkUser = await currentUser();
      const email =
        clerkUser?.emailAddresses?.[0]?.emailAddress ||
        `${userId}@notevault.app`;
      const name =
        clerkUser?.fullName ||
        clerkUser?.firstName ||
        clerkUser?.username ||
        "Workspace User";
      const imageUrl = clerkUser?.imageUrl || null;

      dbUser = await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {
          name,
          email,
          imageUrl,
        },
        create: {
          clerkUserId: userId,
          name,
          email,
          imageUrl,
        },
      });
    } catch (err) {
      console.error("Failed to auto-sync user with Prisma:", err);
      // Retry finding in case of race condition
      dbUser = await prisma.user.findUnique({
        where: { clerkUserId: userId },
      });
    }
  }

  if (!dbUser) {
    // If still missing (e.g. database error), create minimal fallback record
    try {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: userId,
          name: "Workspace User",
          email: `${userId}@notevault.app`,
        },
      });
    } catch {
      redirect("/sign-in");
    }
  }

  return dbUser;
}
