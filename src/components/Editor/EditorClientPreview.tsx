'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const EditorPreview = dynamic(() => import('@/components/Editor/EditorPreview'), {
    ssr: false,
    loading: () => <p>Loading...</p>
})

interface EditorClientProps {
  content: string;
}

export default function EditorClientPreview({ content }: EditorClientProps) {
  return (
    <>
      <EditorPreview content={content} />
    </>
  )
}
