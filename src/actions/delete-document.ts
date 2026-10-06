"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteDocument(documentId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!dbUser) {
      return { success: false, error: "User not found." };
    }

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!doc || doc.userId !== dbUser.id) {
      return { success: false, error: "Document not found or permission denied." };
    }

    await prisma.document.delete({
      where: { id: documentId },
    });

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (err: unknown) {
    console.error("deleteDocument error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete document.",
    };
  }
}
