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
  // ✅ Get all related data
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
      // ✅ Check follow
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: currentUserInDB.id,
            followingId: article.author.id,
          },
        },
      });
      isFollowing = !!follow;

      // ✅ Check bookmark
      const bookmark = await prisma.bookmark.findFirst({
        where: {
          articleId: article.id,
          userId: currentUserInDB.id,
        },
      });
      isBookmarked = !!bookmark;

      // ✅ Check like
      isLiked = likes.some((like) => like.userId === currentUserInDB!.id);
    }
  }

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

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 border rounded-lg p-4 bg-muted/30">
              {/* Author Info */}
              <Link
                href={`/profile/${article.author.id}`}
                className="flex items-center gap-3 hover:bg-muted/50 p-2 rounded-md transition"
              >
                <Avatar className="h-12 w-12 border">
                  <AvatarImage src={article.author.imageUrl || ""} />
                  <AvatarFallback>
                    {article.author.name?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>

                <div>
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

              {/* Follow Button */}
              {authUser && currentUserInDB?.id !== article.author.id && (
                <FollowButton
                  targetUserId={article.author.id}
                  isFollowing={isFollowing}
                />
              )}
            </div>
          </header>

          <div className="border max-w-none mb-12">
            <MdEditorPreview content={article.content} />
          </div>

          {/* Like / Bookmark / Share */}
          <div className="flex gap-2 mb-12 border-t pt-8">
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

          <CommentInput articleId={article.id} />
          <CommentSection comments={comments} />
        </article>
      </main>
    </div>
  );
}
