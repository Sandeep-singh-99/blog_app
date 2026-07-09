import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React from "react";
import LikeButton from "./like-button";
import CommentSection from "../comments/comment-section";
import CommentInput from "../comments/comment-input";
import ShareBtn from "./share-btn";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "../follow-user";
import { currentUser } from "@clerk/nextjs/server";
import BookmarkButton from "./bookmark-button";
import { Badge } from "../ui/badge";
import EditorClientPreview from "../Editor/EditorClientPreview";

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
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <article className="mx-auto max-w-4xl rounded-2xl">
          {/* Featured Image */}
          <div className="relative h-[250px] md:h-[420px] overflow-hidden rounded-t-2xl">
            <Image
              src={article.featuredImageUrl as string}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="py-5">
            {/* Category */}
            <Badge
              variant="secondary"
              className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100"
            >
              {article.category}
            </Badge>

            {/* Title */}
            <h1 className="mb-8 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-5xl">
              {article.title}
            </h1>

            {/* Author Card */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center">
              <Link
                href={`/profile/${article.author.id}`}
                className="flex items-center gap-4"
              >
                <Avatar className="h-14 w-14 border-2 border-white shadow">
                  <AvatarImage src={article.author.imageUrl || ""} />
                  <AvatarFallback>
                    {article.author.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="font-semibold text-gray-900">
                    {article.author.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    Published{" "}
                    {article.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>

              {authUser && currentUserInDB?.id !== article.author.id && (
                <FollowButton
                  targetUserId={article.author.id}
                  isFollowing={isFollowing}
                />
              )}
            </div>

            {/* Content */}
            <EditorClientPreview content={article.content} />

            {/* Actions */}
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
              <LikeButton
                articleId={article.id}
                likes={likes}
                isLiked={isLiked}
              />

              <BookmarkButton
                articleId={article.id}
                userId={currentUserInDB?.id ?? ""}
                isBookmarked={isBookmarked}
              />

              <ShareBtn
                url={`https://blog-app-gamma-self.vercel.app/articles/${article.id}`}
              />
            </div>

            {/* Comments */}
            <div className="mt-5 border-t border-gray-200 pt-10">
              <CommentInput articleId={article.id} />

              <div className="mt-8">
                <CommentSection comments={comments} />
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
