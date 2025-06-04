import EditArticle from '@/components/articles/edit-article'
import { prisma } from '@/lib/prisma';
import React from 'react'

type Props = {
    params:Promise<{id:string}>
}

export default async function page({params}: Props) {
    const { id } = await params;

     const article = await prisma.article.findUnique({
        where:{
          id
        }
      });
      if(!article){
        return <h1>Article not found.</h1>
      }
  return (
    <div>
        <EditArticle article={article}/>
    </div>
  )
}
