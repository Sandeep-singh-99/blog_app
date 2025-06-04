import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react'

type ArticleDetailPageProps = {
  article: Prisma.ArticleGetPayload<{
    include: {
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>;
};

export default async function ArticleDetails({ article }: ArticleDetailPageProps) {
//      const comments = await prisma.comment.findMany({
//     where: {
//       articleId: article.id,
//     },
//     include: {
//       author: {
//         select: {
//           name: true,
//           email: true,
//           imageUrl: true,
//         },
//       },
//     },
//   });
  return (
    <div className='min-h-screen bg-background'>
        <main className='container mx-auto py-12 px-4 sm:px-6 lg:px-8'>
            <article className='mx-auto max-w-3xl'>
                <header className='mb-12'>
                    <div className='flex flex-wrap gap-2 mb-4'>
                        <span className='px-3 py-1 text-sm'>
                            {article.category}
                        </span>
                    </div>
                    <h1 className='text-4xl font-bold mb-4'>{article.title}</h1>

                    <div className='flex items-center gap-4'>
                        <Avatar className='h-10 w-10'>
                            <AvatarImage src={article.author.imageUrl || ''}/>
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>

                        <div>
                            <p className='font-medium'>{article.author.name}</p>
                            <p className='text-sm'>{article.createdAt.toDateString()}</p>
                        </div>
                    </div>
                </header>

                <section className='prose prose-lg dark:prose-invert max-w-none mb-12' dangerouslySetInnerHTML={{__html: article.content}}/>

            </article>
        </main>
    </div>
  )
}
