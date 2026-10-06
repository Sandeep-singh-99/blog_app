import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { uploadPdfToCloudinary } from "@/lib/cloudinary";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User profile not found in database." },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const title = (formData.get("title") as string)?.trim();
    if (!title) {
      return NextResponse.json(
        { error: "Document title is required." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Please select a valid PDF file." },
        { status: 400 }
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF files are supported." },
        { status: 400 }
      );
    }

    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "PDF file size exceeds 25MB limit." },
        { status: 400 }
      );
    }

    const category = (formData.get("category") as string)?.trim() || "General";
    const summary = (formData.get("summary") as string)?.trim() || null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let fileUrl = "";

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
        return NextResponse.json(
          { error: "Failed to upload document. Please check storage configuration." },
          { status: 500 }
        );
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

    return NextResponse.json({
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
    });
  } catch (err: unknown) {
    console.error("API document upload error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Internal server error occurred.",
      },
      { status: 500 }
    );
  }
}
