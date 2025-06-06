"use client";
import React, { useActionState } from "react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { createComment } from "@/actions/create-comment";

type CommentInputProps = {
  articleId: string;
};

export default function CommentInput({ articleId }: CommentInputProps) {
  const [formState, action, isPending] = useActionState(
    createComment.bind(null, articleId),
    { errors: {} }
  );
  return (
    <form action={action} className="mb-8">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={""} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Input
            type="text"
            name="comment"
            placeholder="Write a comment..."
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {formState.errors.comment && <p>{formState.errors.comment}</p>}
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isPending}>
                {isPending ? "Posting..." : "Post Comment"}
            </Button>
          </div>
          {formState.errors.formError && (
            <p className="text-red-500 mt-2">{formState.errors.formError}</p>
          )}
        </div>
      </div>
    </form>
  );
}
