"use client";

import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import { bookmarkArticle } from "@/actions/bookmark-article";

export default function BookmarkButton({
  articleId,
  userId,
  isBookmarked,
}: {
  articleId: string;
  userId: string;
  isBookmarked: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleBookmark = () => {
    if (!userId) return;
    startTransition(async () => {
      await bookmarkArticle(articleId, userId);
    });
  };

  return (
    <Button
      className="gap-2"
      variant="ghost"
      onClick={handleBookmark}
      disabled={isPending || !userId}
    >
      <Bookmark
        className={`h-5 w-5 ${isBookmarked ? "fill-current text-blue-600" : ""}`}
      />
    </Button>
  );
}
