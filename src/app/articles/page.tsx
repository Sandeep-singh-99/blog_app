import AllArticles from '@/components/articles/all-article'
import ArticleSearch from '@/components/articles/article-search'
import React from 'react'

export default function page() {
  return (
    <div className='min-h-screen bg-background'>
        <main className='container mx-auto px-4 py-12 sm:px-6 lg:text-5xl'>

            <div className='mb-12 space-y-6 text-center'>
                <h1 className='text-4xl font-bold sm:text-5xl'>All Articles</h1>

                {/* Search Bar */}
                <ArticleSearch/>
            </div>

            {/* All Articles */}
            <AllArticles articles={[]} />

            <div className='mt-12 flex justify-center gap-2'>

            </div>
        </main>
    </div>
  )
}


