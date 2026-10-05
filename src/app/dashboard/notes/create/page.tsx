import CreateArticle from "@/components/articles/create-article";
import React, { Suspense } from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Capture New Note | NoteVault",
  description: "Create and organize a new rich markdown note in your personal knowledge workspace.",
};

export default function CreateNotePage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={<div className="p-8 text-center text-muted-foreground text-sm">Loading note editor...</div>}>
        <CreateArticle />
      </Suspense>
    </div>
  );
}
