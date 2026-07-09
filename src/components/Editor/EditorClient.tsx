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
}

export default function EditorClient({ content, onChange }: EditorClientProps) {
  return (
    <>
      <Editor content={content} onChange={onChange} />
    </>
  )
}
