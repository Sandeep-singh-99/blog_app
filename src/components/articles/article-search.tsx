import { Search } from 'lucide-react'
import React from 'react'
import { Input } from '../ui/input'

export default function ArticleSearch() {
  return (
    <form className='mx-auto max-w-2xl'>
        <div className='relative mx-4'>
            <Search className='w-5 h-5 absolute left-3 top-1/2 -translate-1/2'/>
            <Input
            type='text'
            name='search'
            placeholder='Search articles...'
            className='w-full pl-10 pr-4 py-6 text-lg'
            />
        </div>
    </form>
  )
}
