import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";
import LikeButton from "./like-button";
import CommentSection from "../comments/comment-section";
import CommentInput from "../comments/comment-input";
import MdEditorPreview from "../mdeditor-preview";
import ShareBtn from "./share-btn";
import Image from "next/image";
import Link from "next/link";

type ArticleDetailPageProps = {
  article: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          id: true;
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
};

export default async function ArticleDetails({
  article,
}: ArticleDetailPageProps) {
  const comments = await prisma.comment.findMany({
    where: {
      articleId: article.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
        },
      },
    },
  });

  const likes = await prisma.like.findMany({
    where: { articleId: article.id },
  });

  const user = await prisma.user.findUnique({
    where: { clerkUserId: article.author.email },
  });

  const isLiked: boolean = likes.some((like) => like.userId === user?.id);
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <header className="mb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 text-sm">{article.category}</span>
            </div>
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
              <Image
                src={article.featuredImageUrl as string}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            <Link
              href={`/profile/${article.author.id}`}
              className="flex items-center gap-4"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author.imageUrl || ""} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-medium">{article.author.name}</p>
                <p className="text-sm">{article.createdAt.toDateString()}</p>
              </div>
            </Link>
          </header>

          <div className="border max-w-none mb-12">
            <MdEditorPreview content={article.content} />
          </div>

          {/* Like Button */}
          <div className="flex gap-2 mb-12 border-t pt-8">
            <LikeButton
              articleId={article.id}
              likes={likes}
              isLiked={isLiked}
            />

            {/* <BookmarkButton
              articleId={article.id}
              userId={user?.id ?? ""}
              isBookmarked={0 < 1}
            /> */}

            <ShareBtn
              url={`https://blog-app-gamma-self.vercel.app/articles/${article.id}`}
            />
          </div>

          <CommentInput articleId={article.id} />

          {/* Comment Section */}
          <CommentSection comments={comments} />
        </article>
      </main>
    </div>
  );
}
