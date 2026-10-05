"use client";

import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { promoteSubNote } from "@/actions/move-subnote";
import { toast } from "sonner";

type PromoteSubNoteBtnProps = {
  noteId: string;
};

export default function PromoteSubNoteBtn({ noteId }: PromoteSubNoteBtnProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={() => {
        startTransition(async () => {
          const res = await promoteSubNote(noteId);
          if (res.success) {
            toast.success("Page promoted to main level");
            window.dispatchEvent(new Event("notes-updated"));
          } else {
            toast.error(res.error || "Failed to promote page");
          }
        });
      }}
    >
      <Button
        variant="outline"
        size="sm"
        type="submit"
        disabled={isPending}
        className="h-8 gap-1.5 text-xs rounded-xl hover:text-purple-600 hover:border-purple-500/40 cursor-pointer"
        title="Promote this subpage to a top-level main page"
      >
        <ArrowUpRight className="h-3.5 w-3.5 text-purple-600" />
        <span>{isPending ? "Promoting..." : "Promote to Page"}</span>
      </Button>
    </form>
  );
}
