import ArticleDetails from '@/components/articles/article-details';
import { prisma } from '@/lib/prisma';
import React from 'react'

type ArticleDetailProps = {
    params: Promise<{id: string}>
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
