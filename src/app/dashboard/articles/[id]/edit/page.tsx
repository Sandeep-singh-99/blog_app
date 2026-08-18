import EditArticle from '@/components/articles/edit-article'
import { prisma } from '@/lib/prisma';
import React from 'react'
import type { Metadata } from 'next';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type Props = {
    params:Promise<{id:string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    select: { title: true }
  });
  return {
    title: article ? `Edit: ${article.title}` : "Edit Article",
    description: "Update your article's title, content, cover image, category, and tags.",
  };
}

export default async function page({params}: Props) {
  const { id } = await params;
  const authUser = await currentUser();

  if (!authUser) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: authUser.id },
  });

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article || article.authorId !== dbUser?.id) {
    return <h1>Article not found or access denied.</h1>;
  }

  return (
    <div>
      <EditArticle article={article}/>
    </div>
  );
}
