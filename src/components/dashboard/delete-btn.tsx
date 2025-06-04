"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";
import { deleteArticle } from "@/actions/delete-article";

type DeleteBtnProps = {
  articleId?: string;
};

export default function DeleteBtn({ articleId }: DeleteBtnProps) {
  const [isPending, startTransition] = useTransition();
  return (
    <form
      action={() => {
        startTransition(async () => {
          await deleteArticle(articleId || "");
        });
      }}
    >
      <Button variant={"ghost"} size={"sm"} disabled={isPending}>
        {isPending ? "Deleting..." : "Delete"}
      </Button>
    </form>
  );
}
