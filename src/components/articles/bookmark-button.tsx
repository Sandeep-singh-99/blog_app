import React from 'react'
import { Button } from '../ui/button'
import { Bookmark } from 'lucide-react'

export default function BookmarkButton() {
  return (
    <div>
         <Button className='gap-2' variant={'ghost'}>
                <Bookmark className='h-5 w-5'/>
            </Button>
    </div>
  )
}
