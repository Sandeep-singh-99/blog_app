"use client";

import React, { useTransition, useState } from "react";
import { Button } from "../ui/button";
import { Bookmark } from "lucide-react";
import { bookmarkArticle } from "@/actions/bookmark-article";

export default function BookmarkButton({
  articleId,
  userId,
  isBookmarked: initialBookmarked,
}: {
  articleId: string;
  userId: string;
  isBookmarked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);

  const handleBookmark = () => {
    if (!userId) return;
    startTransition(async () => {
      const res = await bookmarkArticle(articleId, userId);
      if (res.success) {
        setBookmarked(res.bookmarked);
      }
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
        className={`h-5 w-5 ${
          bookmarked ? "fill-current text-blue-600" : ""
        }`}
      />
    </Button>
  );
}
