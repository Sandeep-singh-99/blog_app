"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { RichTextProvider } from "reactjs-tiptap-editor";
import { extensions } from "./Editor";

// Ensure style is imported
import "reactjs-tiptap-editor/style.css";

interface EditorPreviewProps {
  content: string;
}

export default function EditorPreview({ content }: EditorPreviewProps) {
  const editor = useEditor({
    textDirection: "auto",
    content: content,
    extensions: extensions,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="w-full editor-preview-content animate-in fade-in duration-300">
      <RichTextProvider editor={editor}>
        <>
          <EditorContent editor={editor} className="outline-none" />
        </>
      </RichTextProvider>
    </div>
  );
}
