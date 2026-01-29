"use client";
import React from 'react'
import MDEditor from '@uiw/react-md-editor';
import { useTheme } from 'next-themes';

export default function MdEditorPreview({ content }: { content: string }) {
  const { theme } = useTheme();
  return (
    <div data-color-mode={theme}>
      <MDEditor.Markdown source={content} className='p-4 rounded-md w-full' style={{ backgroundColor: "transparent" }} />
    </div>
  )
}
