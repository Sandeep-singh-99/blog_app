import React from 'react'
import { useEditorState } from '@tiptap/react';

import './style.css'



export const Count = ({ editor, limit = 5000 }: { editor: any; limit?: number }) => {
  const { charactersCount, wordsCount } = useEditorState({
    editor,
    selector: (context) => ({
      charactersCount: context.editor.storage.characterCount.characters(),
      wordsCount: context.editor.storage.characterCount.words(),
    }),
  });

  if (!editor) {
    return null;
  }

  const isOverLimit = wordsCount > limit;
  const percentage = editor ? Math.min(Math.round((100 / limit) * wordsCount), 100) : 0;

  return (
    <div
      className={`character-count !border-t !border-border p-3 flex justify-between items-center ${
        isOverLimit ? 'character-count--warning' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <svg height="20" width="20" viewBox="0 0 20 20">
          <circle r="10" cx="10" cy="10" fill="#e9ecef" />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle r="6" cx="10" cy="10" fill="white" />
        </svg>
        <span className="font-medium text-sm">
          {wordsCount} / {limit} words
        </span>
      </div>
      <div className="text-xs text-muted-foreground">
        ({charactersCount} characters)
      </div>
    </div>
  );
};