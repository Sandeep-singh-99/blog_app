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
    editorProps: {
      attributes: {
        class:
          "w-full max-w-none focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editor && content !== undefined && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    
    const addHeadingIds = () => {
      const container = document.querySelector(".editor-preview-content");
      if (!container) return;
      
      const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
      const seenSlugs: Record<string, number> = {};

      headings.forEach((heading, idx) => {
        const text = heading.textContent?.trim() || "";
        const baseSlug = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `heading-${idx}`;
        
        let uniqueSlug = baseSlug;
        if (seenSlugs[baseSlug] === undefined) {
          seenSlugs[baseSlug] = 0;
        } else {
          seenSlugs[baseSlug] += 1;
          uniqueSlug = `${baseSlug}-${seenSlugs[baseSlug]}`;
        }
        
        heading.setAttribute("id", uniqueSlug);
      });
    };

    // Run after editor renders or content updates
    const timer = setTimeout(addHeadingIds, 150);
    return () => clearTimeout(timer);
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="mx-auto w-full editor-preview-content animate-in fade-in duration-300">
      <RichTextProvider editor={editor}>
        <EditorContent editor={editor} className="outline-none" />
      </RichTextProvider>
    </div>
  );
}
