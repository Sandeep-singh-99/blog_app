import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { DocumentsClient, SerializedDocument } from "@/components/dashboard/documents/documents-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PDFs & Documents | NoteVault",
  description: "Upload, read, and manage your technical PDFs, specifications, and whitepapers.",
};

export default async function DocumentsPage() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-xl font-bold mb-2">Please sign in</h2>
        <p className="text-sm text-muted-foreground">
          You need to be logged in to view and manage your documents library.
        </p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  if (!dbUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-xl font-bold mb-2">Account profile not found</h2>
        <p className="text-sm text-muted-foreground">
          Your account was not found in the database. Please try signing in again.
        </p>
      </div>
    );
  }

  let rawDocs: Array<{
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    fileType: string;
    pages: number | null;
    category: string | null;
    summary: string | null;
    createdAt: Date;
  }> = [];

  try {
    if ("document" in prisma && typeof (prisma as any).document?.findMany === "function") {
      rawDocs = await (prisma as any).document.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("Could not query documents from Prisma:", err);
  }

  const documents: SerializedDocument[] = rawDocs.map((doc) => ({
    id: doc.id,
    title: doc.title,
    fileName: doc.fileName,
    fileUrl: doc.fileUrl,
    fileSize: doc.fileSize,
    fileType: doc.fileType,
    pages: doc.pages,
    category: doc.category,
    summary: doc.summary,
    createdAt: doc.createdAt.toISOString(),
  }));

  return <DocumentsClient initialDocuments={documents} />;
}
