import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import { FileText, MessageCircle, PlusCircle, RatioIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import RecentArticle from './recent-article'
import { prisma } from '@/lib/prisma'

export default async function BlogDashboard() {
    const [articles, totalComments] = await Promise.all([
    prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        comments: true,
        author: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
          },
        },
      },
    }),
    prisma.comment.count(),
  ]);
  return (
    <main className='flex-1 p-4 md:p-8'>
        <div className='flex justify-between items-center mb-6'> 
            <div>
                <h1 className='text-2xl font-bold'>Dashboard</h1>
                <p className=''>Welcome to your blog dashboard</p>
            </div>

            <Link href={"/dashboard/articles/create"}>
            <Button>
                 <PlusCircle className='h-4 w-4'/>
                New Article
            </Button>
            </Link>
        </div>

        {/* Stats */}

        <div className='grid md:grid-cols-3 mb-8 gap-4'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='font-medium text-sm'>Total Article</CardTitle>
                    <FileText className='w-4 h-4'/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{articles.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">+5 from last month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='font-medium text-sm'>Total Comment</CardTitle>
                    <MessageCircle className='w-4 h-4'/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>{totalComments}</div>
                    <p className="text-xs text-muted-foreground mt-1">+5 from last month</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='font-medium text-sm'>Total Rating</CardTitle>
                    <RatioIcon className='w-4 h-4'/>
                </CardHeader>
                <CardContent>
                    <div className='text-2xl font-bold'>2</div>
                    <p className="text-xs text-muted-foreground mt-1">+5 from last month</p>
                </CardContent>
            </Card>
        </div>

        {/* Recent Articles */}
       <RecentArticle articles={articles} />
    </main>
  )
}
