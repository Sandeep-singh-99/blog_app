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
  tags: z.string().min(1, "At least one tag required"),
});

type EditArticlesFormState = {
  errors: {
    title?: string[];
    content?: string[];
    category?: string[];
    tags?: string[];
    featuredImageUrl?: string[];
    formErrors?: string[];
  };
};

export const editArticle = async (
  articleId: string,
  prevState: EditArticlesFormState,
  formData: FormData
): Promise<EditArticlesFormState> => {
  const result = createArticleSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    category: formData.get("category"),
    tags: formData.get("tags"),
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

  const existingArticle = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!existingArticle) {
    return {
      errors: {
        formErrors: ["Article not found."],
      },
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!existingUser || existingUser.id !== existingArticle.authorId) {
    return {
      errors: {
        formErrors: ["User not found."],
      },
    };
  }

  // Start creating article

  const imageFile = formData.get("featuredImageUrl") as File | null;
  let imageUrl = existingArticle.featuredImageUrl;
  if (imageFile && imageFile.size > 5 * 1024 * 1024) {
    // 5MB limit
    return {
      errors: {
        featuredImageUrl: ["Image size must be less than 5MB."],
      },
    };
  }

  if (imageFile && imageFile.name !== "undefined") {
    try {
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

      if (uploadResponse?.secure_url) {
        imageUrl = uploadResponse.secure_url;
      } else {
        return {
          errors: {
            featuredImageUrl: ["Failed to upload image."],
          },
        };
      }
    } catch (error) {
      if (error instanceof Error) {
        return {
          errors: {
            featuredImageUrl: [error.message],
          },
        };
      } else {
        return {
          errors: {
            featuredImageUrl: ["Some internal server error occurred."],
          },
        };
      }
    }
  }

  //   let imageUrl = existingArticle.featuredImageUrl;

  if (!imageUrl) {
    return {
      errors: {
        featuredImageUrl: ["Failed to upload image."],
      },
    };
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: {
        title: result.data.title,
        content: result.data.content,
        category: result.data.category,
        tags: result.data.tags.split(",").map((tag) => tag.trim()),
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
