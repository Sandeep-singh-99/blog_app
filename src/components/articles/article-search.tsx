'use client'
import { Search } from 'lucide-react'
import React, { FormEvent } from 'react'
import { Input } from '../ui/input'
import { searchAction } from '@/actions/search'
import { useSearchParams } from 'next/navigation'

export default function ArticleSearch() {
  const searchParams = useSearchParams()
  return (
    <form action={searchAction} className='mx-auto max-w-2xl'>
        <div className='relative mx-4'>
            <Search className='w-5 h-5 absolute left-3 top-1/2 -translate-1/2'/>
            <Input
            type='text'
            name='search'
            defaultValue={searchParams.get('search') || ''}
            placeholder='Search articles...'
            className='w-full pl-10 pr-4 py-6 text-lg'
            />
        </div>
    </form>
  )
}
