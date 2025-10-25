// import React from 'react'
// import { prisma } from '@/lib/prisma'
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Separator } from '@/components/ui/separator';

// type ArticleDetailProps = {
//     params: Promise<{id: string}>
// }

// export default async function Profile({params}: ArticleDetailProps) {
//   const { id } = await params;

//   const user = await prisma.user.findUnique({
//     where: {
//       id
//     }
//   });

//   if (!user) {
//     return <h1>User not found.</h1>;
//   }

//   return (
//     <div className='flex ml-20 gap-10 '>
//       <div className='max-w-5xl mx-auto w-full mt-20'>
//         <h1 className='text-4xl font-semibold'>{user.name}</h1>
//         <Separator className="my-4" />
//       </div>
//       <div className='w-2/4'>
//         <Avatar className="h-24 w-24 mx-auto mt-10">
//           <AvatarImage src={user.imageUrl || ""} />
//           <AvatarFallback>{user.name?.slice(0,2).toUpperCase()}</AvatarFallback>
//         </Avatar>
//       </div>
//     </div>
//   )
// }










import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto mt-16 px-6">
      {/* LEFT SIDE - POSTS */}
      <div className="flex-1">
        <h1 className="text-4xl font-semibold">Shikhar Vaish</h1>

        {/* Tabs */}
        <div className="mt-6 flex gap-8 border-b pb-2 text-sm font-medium text-muted-foreground">
          <button className="border-b-2 border-black text-black pb-2">Home</button>
          <button className="hover:text-black">About</button>
        </div>

        {/* Posts List */}
        <div className="mt-8 space-y-10">
          {[1, 2, 3].map((post) => (
            <div
              key={post}
              className="flex justify-between gap-6 border-b pb-6 hover:bg-muted/20 rounded-md transition"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Published in{" "}
                  <span className="font-medium text-black">Geek Culture</span>
                </p>
                <h2 className="text-lg font-semibold hover:underline">
                  Building a Rich Text Editor: Day {post}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Designing Model Events
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <span>Apr {20 - post}, 2021</span>
                  <span>•</span>
                  <span>50 views</span>
                  <span>•</span>
                  <span>1 comment</span>
                </div>
              </div>

              <Image
                src="/placeholder-image.png"
                alt="post thumbnail"
                width={120}
                height={80}
                className="rounded-md object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - SIDEBAR */}
      <aside className="w-full md:w-72 md:sticky top-20">
        <div className="flex flex-col items-center text-center border rounded-xl p-6 shadow-sm">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="/user-avatar.jpg" />
            <AvatarFallback>SV</AvatarFallback>
          </Avatar>

          <h2 className="text-lg font-semibold">Shikhar Vaish</h2>
          <p className="text-sm text-muted-foreground">69 followers</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Love building collaborative tools
          </p>

          <Button className="mt-4 w-full">Follow</Button>

          <Separator className="my-4" />

          {/* Following list */}
          <div className="w-full text-left">
            <h3 className="font-medium mb-3">Following</h3>
            <div className="space-y-2">
              {["Anjali.T", "Abirami Vina", "Rehost", "Nir Z.", "Edward Dixon"].map(
                (name, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`/avatar-${i}.jpg`} />
                      <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{name}</span>
                  </div>
                )
              )}
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
