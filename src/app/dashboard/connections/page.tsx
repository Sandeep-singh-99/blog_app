import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const dynamic = 'force-dynamic';

export default async function ConnectionsPage() {
  const authUser = await currentUser();

  if (!authUser) {
    // 🔒 Redirect to sign-in if user not logged in
    redirect("/sign-in");
  }

  //  Find the corresponding user in your DB
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  if (!dbUser) {
    throw new Error("User not found in the database.");
  }

  const userId = dbUser.id;

  //  Fetch Followers (people who follow you)
  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  //  Fetch Following (people you follow)
  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" />
        <h1 className="text-2xl font-semibold">Your Connections</h1>
      </div>

      {/* Tabs for Followers / Following */}
      <Tabs defaultValue="followers" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="followers">
            Followers ({followers.length})
          </TabsTrigger>
          <TabsTrigger value="following">
            Following ({following.length})
          </TabsTrigger>
        </TabsList>

        {/* Followers List */}
        <TabsContent value="followers" className="mt-6">
          {followers.length === 0 ? (
            <p className="text-center text-muted-foreground">
              You don’t have any followers yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {followers.map(({ follower }) => (
                <li
                  key={follower.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition"
                >
                  <Link
                    href={`/profile/${follower.id}`}
                    className="flex items-center gap-3 w-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={follower.imageUrl || ""} />
                      <AvatarFallback>
                        {follower.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{follower.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {/* Following List */}
        <TabsContent value="following" className="mt-6">
          {following.length === 0 ? (
            <p className="text-center text-muted-foreground">
              You’re not following anyone yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {following.map(({ following }) => (
                <li
                  key={following.id}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition"
                >
                  <Link
                    href={`/profile/${following.id}`}
                    className="flex items-center gap-3 w-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={following.imageUrl || ""} />
                      <AvatarFallback>
                        {following.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{following.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
