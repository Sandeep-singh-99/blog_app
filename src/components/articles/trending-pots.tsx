import React from "react";
import { prisma } from "@/lib/prisma";
import ArticleCard from "./ArticleCard";

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
    <main className=" mx-auto  py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
        🔥 Trending Posts
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trendingPosts.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
