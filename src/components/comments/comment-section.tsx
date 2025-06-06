import { Prisma } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import React from 'react'

type CommentSectionProps = {
    comments: Prisma.CommentGetPayload<{
        include: {
            user: {
                select: {
                    name: true
                    email: true
                    imageUrl: true
                }
            }
        }
    }>[]
}

export default function CommentSection({ comments }: CommentSectionProps) {
  return (
    <div className='space-y-8'>
        {comments.map(comment => (
            <div key={comment.id} className='flex gap-4'>
                <Avatar>
                    <AvatarImage src={comment.user.imageUrl || ''}/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className='flex-1'>
                    <div className='mb-2'>
                        <span className='font-medium'>{comment.user.name}</span>
                        <span className='text-sm ml-2'>{comment.createdAt.toDateString()}</span>
                    </div>
                    <p>
                        {comment.content}
                    </p>
                </div>
            </div>
        ))}
    </div>
  )
}
