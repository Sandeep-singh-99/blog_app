import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import React from 'react'

export default function CommentSection() {
  return (
    <div className='space-y-8'>
        <div className='flex gap-4'>
            <Avatar>
                <AvatarImage src={""}/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className='flex-1'>
                <div className='mb-2'>
                    <span className='font-medium'>Comment author name</span>
                    <span className='text-sm ml-2'>12 feb</span>
                </div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>
    </div>
  )
}
