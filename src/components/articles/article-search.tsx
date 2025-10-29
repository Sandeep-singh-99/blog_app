'use client';
import { Search } from 'lucide-react';
import React from 'react';
import { Input } from '../ui/input';
import { searchAction } from '@/actions/search';
import { useSearchParams } from 'next/navigation';

export default function ArticleSearch() {
  const searchParams = useSearchParams();

  return (
    <form
      action={searchAction}
      className="mx-auto w-full max-w-2xl px-4 md:px-0"
    >
      <div className="relative">
        {/* Search Icon */}
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />

        {/* Input */}
        <Input
          type="text"
          name="search"
          defaultValue={searchParams.get('search') || ''}
          placeholder="Search articles, tags, or authors..."
          className="
            w-full
            rounded-2xl
            border border-border
            bg-background/70
            backdrop-blur-sm
            pl-12 pr-4 py-5
            text-base md:text-lg
            placeholder:text-muted-foreground/70
            focus-visible:ring-2
            focus-visible:ring-blue-500
            focus-visible:ring-offset-0
            transition-all duration-200
            shadow-sm hover:shadow-md
          "
        />
      </div>
    </form>
  );
}
