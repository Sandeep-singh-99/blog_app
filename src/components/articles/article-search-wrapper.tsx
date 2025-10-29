'use client'

import React, { Suspense } from 'react'
import ArticleSearch from './article-search'


export default function ArticleSearchWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-4">Loading search...</div>}>
        <ArticleSearch />
    </Suspense>
  )
}
