import React from 'react'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

export default function CommentInput() {
  return (
    <form action={""} className='mb-8'>
        <div className='flex gap-4'>
            <Avatar>
                <AvatarImage src={""} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className='flex-1'>
                <Input
        type='text'
        name='comment'
        placeholder='Write a comment...'
        className='w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <div className='mt-4 flex justify-end'>
            <Button>
                POST Comment
            </Button>
        </div>
            </div>
        </div>
    </form>
  )
}
