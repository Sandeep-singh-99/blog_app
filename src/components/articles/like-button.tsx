'use client'
import React, { useOptimistic, useTransition } from 'react'
import { Button } from '../ui/button'
import { Bookmark, Share2, ThumbsUp } from 'lucide-react'
import { toggleLike } from '@/actions/like-toggle'
import { Like } from '@prisma/client'

type LikeButtonProps = {
    articleId: string,
    likes: Like[],
    isLiked: boolean
}

export default function LikeButton({ articleId, likes, isLiked }: LikeButtonProps) {
    const [optimisticLike, setOptimisticLike] = useOptimistic(likes.length)
    const [isPending, startTransition] = useTransition()

    const handleLikeDisLike = async () => {
        startTransition(async () => {
            setOptimisticLike(isLiked ? optimisticLike - 1 : optimisticLike + 1)
            await toggleLike(articleId)
        })
    }
  return (
    <div className='flex gap-4 mb-12 border-t pt-8'>
        <form action={handleLikeDisLike}>
            <Button disabled={isPending} className='gap-2' variant={'ghost'}>
                <ThumbsUp className='h-5 w-5'/>
                {optimisticLike}
            </Button>

            <Button className='gap-2' variant={'ghost'}>
                <Bookmark className='h-5 w-5'/>
            </Button>

            <Button className='gap-2' variant={'ghost'}>
                <Share2 className='h-5 w-5'/>
            </Button>
        </form>
    </div>
  )
}
