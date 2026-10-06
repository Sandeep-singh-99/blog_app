import { getAuthenticatedUser } from "@/lib/auth-user";
import { prisma } from "@/lib/prisma";
import { DocumentsClient, SerializedDocument } from "@/components/dashboard/documents/documents-client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PDFs & Documents | NoteVault",
  description: "Upload, read, and manage your technical PDFs, specifications, and whitepapers.",
};

export default async function DocumentsPage() {
  const dbUser = await getAuthenticatedUser();

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
