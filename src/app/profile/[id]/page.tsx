import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import { prisma } from "@/lib/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import EditProfile from "@/components/edit-profile";

type ArticleDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function ProfilePage({ params }: ArticleDetailProps) {
  const { id } = await params;

  const authUser = await currentUser();

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      articles: {
        select: {
          id: true,
          title: true,
          featuredImageUrl: true,
          category: true,
          createdAt: true,
          comments: true,
        },
      },
    },
  });


  if (!user) {
    return <h1>User not found.</h1>;
  }

  const isOwner = authUser?.id === user.clerkUserId;

  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto mt-16 px-6">
      {/* LEFT SIDE - POSTS */}
      <div className="flex-1">
        <h1 className="text-4xl font-semibold">{user.name}</h1>

        {/* Tabs */}
        <Tabs
          defaultValue="posts"
          className="mt-6 flex gap-4 pb-2 text-sm font-medium text-muted-foreground"
        >
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="posts">
            {user.articles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No posts available.
              </p>
            ) : (
              <div>
                {user.articles.map((article) => (
                  <div
                    key={article.id}
                    className="flex justify-between gap-6 border-b py-4 hover:bg-muted/20 rounded-md transition"
                  >
                    <div className="flex flex-col gap-2">
                      <Link href={`/articles/${article.id}`} className="text-lg font-semibold cursor-pointer hover:underline">
                        {article.title}
                      </Link>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>
                          {article.createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>{article.comments.length} comments</span>
                      </div>
                    </div>

                    <Image
                      src={article.featuredImageUrl}
                      alt="post thumbnail"
                      width={120}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <p className="text-sm text-muted-foreground ">
              This is the about section for {user.name}. More details about the
              user can be added here.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT SIDE - SIDEBAR */}
      <aside className="w-full md:w-72 md:sticky top-20">
        <div className="flex flex-col items-center text-center border rounded-xl p-6 shadow-sm">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.imageUrl || ""} />
            <AvatarFallback>
              {user.name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">69 followers</p>
          {isOwner ? (
            // <Button
            //   variant="outline"
            //   size="sm"
            //   className="mt-2"
            // >
            //   Edit bio
            // </Button>
            <EditProfile />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Love building collaborative tools
            </p>
          )}

          <Button className="mt-4 w-full">Follow</Button>

          <Separator className="my-4" />

          {/* Following list */}
          <div className="w-full text-left">
            <h3 className="font-medium mb-3">Following</h3>
            <div className="space-y-2">
              {[
                "Anjali.T",
                "Abirami Vina",
                "Rehost",
                "Nir Z.",
                "Edward Dixon",
              ].map((name, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/avatar-${i}.jpg`} />
                    <AvatarFallback>{name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{name}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2 cursor-pointer hover:underline">
                See all (76)
              </p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
