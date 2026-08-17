import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import {
  FileText,
  MessageCircle,
  PlusCircle,
  RatioIcon,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import RecentArticle from "./recent-article";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function BlogDashboard() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
        <h2 className="text-2xl font-semibold mb-2">Please sign in</h2>
        <p className="text-muted-foreground">
          You need to be logged in to view your dashboard.
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
        <h2 className="text-2xl font-semibold mb-2">No profile found</h2>
        <p className="text-muted-foreground">
          Your account doesn't exist in the database.
        </p>
      </div>
    );
  }

  const [articles, totalComments, totalLikes] = await Promise.all([
    prisma.article.findMany({
      where: {
        authorId: dbUser.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: true,
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    }),
    prisma.comment.count({
      where: {
        article: {
          authorId: dbUser.id,
        },
      },
    }),
    prisma.like.count({
      where: {
        article: {
          authorId: dbUser.id,
        },
      },
    }),
  ]);
  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-600">
            Welcome to your BitWrite dashboard
          </p>
        </div>

        <Link href="/dashboard/articles/create">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {/* Articles */}
        <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Articles
            </CardTitle>

            <div className="rounded-lg bg-blue-100 p-2">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {articles.length}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Published articles on your blog
            </p>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Comments
            </CardTitle>

            <div className="rounded-lg bg-emerald-100 p-2">
              <MessageCircle className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {totalComments}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Comments received from readers
            </p>
          </CardContent>
        </Card>

        {/* Likes */}
        <Card className="border-2 shadow-sm hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Likes
            </CardTitle>

            <div className="rounded-lg bg-amber-100 p-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
          </CardHeader>

          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {totalLikes}
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Likes received from readers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Articles */}
      <RecentArticle articles={articles} />
    </main>
  );
}
