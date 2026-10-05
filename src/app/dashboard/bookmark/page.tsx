import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Pinned Knowledge | NoteVault",
  description: "View and access your pinned knowledge bases, notes, and technical references.",
};

export default async function BookmarksPage() {
  const authUser = await currentUser();

  if (!authUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold mb-4">Please sign in</h2>
        <p className="text-muted-foreground">
          You need to be logged in to view your bookmarked articles.
        </p>
      </div>
    );
  }

  //  Get logged-in user in DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  if (!dbUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h2 className="text-2xl font-semibold mb-4">No profile found</h2>
        <p className="text-muted-foreground">
          Your account doesn’t exist in the database.
        </p>
      </div>
    );
  }

  //  Fetch all bookmarked articles for this user
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: dbUser.id },
    include: {
      article: {
        include: {
          author: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-semibold mb-2">No pinned notes yet 📑</h2>
        <p className="text-muted-foreground text-sm">
          Knowledge notes and references you pin or save will appear here.
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto py-6 px-2 sm:px-4 w-full">
      <h1 className="text-2xl sm:text-3xl font-black mb-6">Pinned Knowledge & Notes</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((bookmark) => {
          const article = bookmark.article;
          return (
            <Card
              key={bookmark.id}
              className="group border border-border hover:shadow-md transition-all duration-200 bg-card"
            >
              {article.featuredImageUrl ? (
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
                    <Image
                      src={article.featuredImageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
              ) : (
                <div className="h-24 w-full bg-muted/60 rounded-t-xl flex items-center justify-center border-b border-border/40">
                  <span className="text-xs font-mono text-muted-foreground/70">Saved Note</span>
                </div>
              )}

              <CardContent className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(article.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <Link href={`/articles/${article.id}`}>
                    <CardTitle className="text-lg font-semibold hover:underline">
                      {article.title}
                    </CardTitle>
                  </Link>

                  <Separator className="my-3" />

                  {/* Author info */}
                  <Link
                    href={`/profile/${article.author.id}`}
                    className="flex items-center gap-3 mt-2"
                  >
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={article.author.imageUrl || ""} />
                      <AvatarFallback>
                        {article.author.name?.[0]?.toUpperCase() || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Author</p>
                    </div>
                  </Link>
                </div>

                <Button asChild variant="outline" className="mt-4 w-full">
                  <Link href={`/articles/${article.id}`}>Read Article</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
