"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createArticleSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10).max(5000),
  category: z.string().min(3).max(50),
});

type CreateArticlesFormState = {
  errors: {
    title?: string[];
    content?: string[];
    category?: string[];
    featuredImageUrl?: string[];
    formErrors?: string[];
  };
};

export const createArticle = async (
  prevState: CreateArticlesFormState,
  formData: FormData
): Promise<CreateArticlesFormState> => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { userId } = await auth();
  if (!userId) {
    return {
      errors: {
        formErrors: ["You must be logged in to create an article."],
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!existingUser) {
    return {
      errors: {
        formErrors: ["User not found."],
      },
    };
  }

  // Start creating article

  const imageFile = formData.get("featuredImageUrl") as File | null;
  if (imageFile && imageFile.size > 5 * 1024 * 1024) {
    // 5MB limit
    return {
      errors: {
        featuredImageUrl: ["Image size must be less than 5MB."],
      },
    };
  }

  if (!imageFile || imageFile.name === "undefined") {
    return {
      errors: {
        featuredImageUrl: ["Featured image is required."],
      },
    };
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);

  const uploadResponse: UploadApiResponse | undefined = await new Promise(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(imageBuffer);
    }
  );

  const imageUrl = uploadResponse?.secure_url;

  if (!imageUrl) {
    return {
      errors: {
        featuredImageUrl: ["Failed to upload image."],
      },
    };
  }

  try {
    await prisma.article.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        category: result.data.category,
        featuredImageUrl: imageUrl,
        authorId: existingUser.id,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return {
        errors: {
          formErrors: [error.message],
        },
      };
    } else {
      return {
        errors: {
          formErrors: ["Some internal server error occurred."],
        },
      };
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
};
