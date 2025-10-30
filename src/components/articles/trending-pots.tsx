import React from "react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default async function TrendingPosts() {
  // Fetch posts + likes + comments counts
  const posts = await prisma.article.findMany({
    include: {
      _count: { select: { likes: true, comments: true } },
      author: { select: { name: true, imageUrl: true } },
    },
  });

  // Sort by engagement (likes + comments)
  const trendingPosts = posts
    .map((p) => ({
      ...p,
      engagementScore: p._count.likes + p._count.comments,
    }))
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 6);

  if (trendingPosts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20 text-muted-foreground">
        No trending posts yet.
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
        🔥 Trending Posts
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trendingPosts.map((article) => (
          <Card
            key={article.id}
            className={cn(
              "group relative overflow-hidden transition-all hover:scale-[1.02]",
              "border border-gray-200/50 dark:border-white/10",
              "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg"
            )}
          >
            <div className="p-6">
              <Link href={`/articles/${article.id}`} className="flex flex-col">
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                  <Image
                    src={article.featuredImageUrl}
                    alt="Article Image"
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={article.author.imageUrl || ""} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span>{article.author.name}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                  {article.title}
                </h3>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                  {article.category}
                </p>

                <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{article.createdAt.toISOString().split("T")[0]}</span>
                  <span>
                    ❤️ {article._count.likes} · 💬 {article._count.comments}
                  </span>
                </div>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
