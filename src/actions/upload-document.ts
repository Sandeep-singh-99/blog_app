"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadPdfToCloudinary } from "@/lib/cloudinary";
import path from "path";
import fs from "fs/promises";

export type UploadDocumentState = {
  success?: boolean;
  error?: string;
  document?: {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    category: string | null;
    createdAt: Date;
  };
};

export async function uploadDocument(
  prevState: UploadDocumentState | null,
  formData: FormData
): Promise<UploadDocumentState> {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { error: "You must be signed in to upload documents." };
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!dbUser) {
      return { error: "User profile not found in database." };
    }

    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      return { error: "Please enter a document title." };
    }

    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      return { error: "Please select a valid PDF file to upload." };
    }

    // Validate PDF mime type or extension
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return { error: "Only PDF files are supported." };
    }

    // Limit size to 25MB
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { error: "PDF file size must be less than 25MB." };
    }

    const category = (formData.get("category") as string)?.trim() || "General";
    const summary = (formData.get("summary") as string)?.trim() || null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileUrl = "";

    // Upload to Cloudinary with fallback to local public uploads
    try {
      const uploadRes = await uploadPdfToCloudinary(buffer, file.name);
      fileUrl = uploadRes.secure_url;
    } catch (uploadError) {
      console.warn("Cloudinary upload failed, attempting local fallback:", uploadError);

      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "documents");
        await fs.mkdir(uploadDir, { recursive: true });
        const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadDir, safeName);
        await fs.writeFile(filePath, buffer);
        fileUrl = `/uploads/documents/${safeName}`;
      } catch (localError) {
        console.error("Local storage fallback also failed:", localError);
        return {
          error: "Failed to upload document. Please check your storage settings and try again.",
        };
      }
    }

    const newDoc = await prisma.document.create({
      data: {
        title,
        fileName: file.name,
        fileUrl,
        fileSize: file.size,
        fileType: "application/pdf",
        category,
        summary,
        userId: dbUser.id,
      },
    });

    revalidatePath("/dashboard/documents");
    revalidatePath("/dashboard");

    return {
      success: true,
      document: {
        id: newDoc.id,
        title: newDoc.title,
        fileName: newDoc.fileName,
        fileUrl: newDoc.fileUrl,
        fileSize: newDoc.fileSize,
        category: newDoc.category,
        createdAt: newDoc.createdAt,
      },
    };
  } catch (err: unknown) {
    console.error("uploadDocument error:", err);
    return {
      error:
        err instanceof Error ? err.message : "An unexpected error occurred while uploading.",
    };
  }
}
