'use client'

import dynamic from 'next/dynamic'
import React from 'react'

const Editor = dynamic(() => import('@/components/Editor/Editor'), {
    ssr: false,
    loading: () => <p>Loading...</p>
})

interface EditorClientProps {
  content: string;
  onChange: (value: string) => void;
  limit?: number;
}

export default function EditorClient({ content, onChange, limit }: EditorClientProps) {
  return (
    <>
      <Editor content={content} onChange={onChange} limit={limit} />
    </>
  )
}
