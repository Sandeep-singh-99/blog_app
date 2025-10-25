import React from 'react'
import { prisma } from '@/lib/prisma'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

type ArticleDetailProps = {
    params: Promise<{id: string}>
}

export default async function Profile({params}: ArticleDetailProps) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });

  if (!user) {
    return <h1>User not found.</h1>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.imageUrl || ""} />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  )
}
