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
import FollowButton from "../follow-user";
import { currentUser } from "@clerk/nextjs/server";
import BookmarkButton from "./bookmark-button";
import { Badge } from "../ui/badge";

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

export default async function ArticleDetails({ article }: ArticleDetailPageProps) {
  // Fetch related data
  const comments = await prisma.comment.findMany({
    where: { articleId: article.id },
    include: { user: true },
  });

  const likes = await prisma.like.findMany({
    where: { articleId: article.id },
  });

  const authUser = await currentUser();

  let currentUserInDB = null;
  let isFollowing = false;
  let isBookmarked = false;
  let isLiked = false;

  if (authUser) {
    currentUserInDB = await prisma.user.findUnique({
      where: { clerkUserId: authUser.id },
    });

    if (currentUserInDB) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserInDB.id,
            followingId: article.author.id,
          },
        },
      });
      isFollowing = !!follow;

      const bookmark = await prisma.bookmark.findFirst({
        where: {
          articleId: article.id,
          userId: currentUserInDB.id,
        },
      });
      isBookmarked = !!bookmark;

      isLiked = likes.some((like) => like.userId === currentUserInDB!.id);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          {/* Article Header */}
          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs sm:text-sm">
                {article.category}
              </Badge>
            </div>

            {/* Featured Image */}
            <div className="relative mb-5 w-full h-52 sm:h-64 md:h-80 overflow-hidden rounded-xl shadow-md">
              <Image
                src={article.featuredImageUrl as string}
                alt={article.title}
                fill
                priority
                className="object-cover object-center hover:scale-105 transition-transform duration-300"
              />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3 break-words">
              {article.title}
            </h1>

            {/* Author Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border rounded-lg p-4 bg-muted/30 backdrop-blur-sm">
              <Link
                href={`/profile/${article.author.id}`}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition w-full sm:w-auto"
              >
                <Avatar className="h-11 w-11 border">
                  <AvatarImage src={article.author.imageUrl || ""} />
                  <AvatarFallback>
                    {article.author.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold text-base hover:underline">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Published on{" "}
                    <span className="font-medium">
                      {article.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                </div>
              </Link>

              {/* Follow button (only show if not the author) */}
              {authUser && currentUserInDB?.id !== article.author.id && (
                <div className="w-full sm:w-auto">
                  <FollowButton
                    targetUserId={article.author.id}
                    isFollowing={isFollowing}
                  />
                </div>
              )}
            </div>
          </header>

          {/* Article Content */}
          <section className="prose prose-sm sm:prose-base dark:prose-invert max-w-none border rounded-lg p-4 mb-12 bg-card">
            <MdEditorPreview content={article.content} />
          </section>

          {/* Like / Bookmark / Share Section */}
          <div className="flex flex-wrap gap-3 mb-12 border-t pt-6">
            <LikeButton articleId={article.id} likes={likes} isLiked={isLiked} />

            <BookmarkButton
              articleId={article.id}
              userId={currentUserInDB?.id ?? ""}
              isBookmarked={isBookmarked}
            />

            <ShareBtn
              url={`https://blog-app-gamma-self.vercel.app/articles/${article.id}`}
            />
          </div>

          {/* Comment Section */}
          <section className="space-y-6">
            <CommentInput articleId={article.id} />
            <CommentSection comments={comments} />
          </section>
        </article>
      </main>
    </div>
  );
}
