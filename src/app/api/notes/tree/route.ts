import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ notes: [] });
    }

    const mainNotes = await prisma.article.findMany({
      where: {
        authorId: dbUser.id,
        parentId: null,
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        createdAt: true,
        subNotes: {
          select: {
            id: true,
            title: true,
            parentId: true,
            updatedAt: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ notes: mainNotes });
  } catch (error) {
    console.error("Error fetching notes tree:", error);
    return NextResponse.json({ error: "Failed to fetch notes tree" }, { status: 500 });
  }
}
