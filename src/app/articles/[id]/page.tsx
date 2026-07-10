import ArticleDetails from '@/components/articles/article-details';
import { prisma } from '@/lib/prisma';
import React from 'react'
import type { Metadata } from 'next';

type ArticleDetailProps = {
    params: Promise<{id: string}>
}

export async function generateMetadata({params}: ArticleDetailProps): Promise<Metadata> {
  const { id } = await params;
  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          name: true,
        }
      }
    }
  });

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  // Create plain text description by stripping HTML
  const plainText = article.content.replace(/<[^>]*>/g, '').trim();
  const description = plainText.length > 150
    ? `${plainText.substring(0, 150)}...`
    : plainText || `Read ${article.title} on BitWrite.`;

  return {
    title: article.title,
    description: description,
    openGraph: {
      title: article.title,
      description: description,
      type: "article",
      publishedTime: article.createdAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: description,
    }
  };
}

export default async function page({params}: ArticleDetailProps) {
  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id},
    include: {
        author: {
            select: {
                id: true,
                name: true,
                email: true,
                imageUrl: true
            }
        }
    }
  })

  if (!article) {
    return <h1>Article not found.</h1>
  }

  return (
    <div>
        <ArticleDetails article={article} />
    </div>
  )
}
