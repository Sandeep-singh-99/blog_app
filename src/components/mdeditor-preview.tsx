"use client";
import React from 'react'
import MDEditor from '@uiw/react-md-editor';

export default function MdEditorPreview({ content }: { content: string }) {
  return (
    <MDEditor.Markdown source={content} className='p-4 rounded-md w-full' />
  )
}
