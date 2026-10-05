"use client";
import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
  useEffect,
} from "react";
import { Button } from "../ui/button";
import { createArticle } from "@/actions/create-article";
import { toast } from "sonner";
import { ArrowLeft, Save, Lock } from "lucide-react";
import EditorClient from "../Editor/EditorClient";
import { useRouter } from "next/navigation";
import { countWords } from "@/lib/utils";

export default function CreateArticle() {
  const [content, setContent] = useState("");
  const router = useRouter();

  const [formState, action, isPending] = useActionState(createArticle, {
    errors: {},
  });

  // Watch for successful action and redirect/notify
  useEffect(() => {
    if (formState.success) {
      toast.success("Note created successfully!");
      router.push("/dashboard/notes");
    } else if (formState.errors.formErrors?.length) {
      toast.error(formState.errors.formErrors[0]);
    }
  }, [formState, router]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = (formData.get("title") as string)?.trim();

    if (!title || title.length < 1) {
      toast.error("Please enter a note title.");
      return;
    }

    if (!content || content.trim().length < 5) {
      toast.error("Note content cannot be empty (min 5 characters).");
      return;
    }

    const wordCount = countWords(content);
    if (wordCount > 10000) {
      toast.error(
        `Content exceeds maximum limit of 10,000 words (${wordCount} words).`
      );
      return;
    }

    formData.set("content", content);

    startTransition(() => {
      action(formData);
    });
  };

  const plainText = content.replace(/<[^>]+>/g, " ").trim();
  const wordCount = plainText
    ? plainText.split(/\s+/).filter(Boolean).length
    : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Top Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard/notes")}
            className="text-muted-foreground hover:text-foreground h-8 px-2 gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Notes</span>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/notes")}
              disabled={isPending}
              className="h-8 px-3 text-xs font-medium rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="h-8 px-4 gap-1.5 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all cursor-pointer"
            >
              {isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Note</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Note Metadata / Status Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Lock className="h-3 w-3" />
            <span>Private Note</span>
          </span>

          <span className="text-xs text-muted-foreground font-mono">
            {wordCount} words • {readTimeMinutes} min read
          </span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <input
            type="text"
            name="title"
            placeholder="Untitled Note..."
            className="w-full text-3xl sm:text-4xl font-black tracking-tight bg-transparent border-none outline-none focus:outline-none placeholder:text-muted-foreground/30 py-1 text-foreground"
            required
            autoFocus
          />
          {formState.errors.title && (
            <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              {formState.errors.title[0]}
            </p>
          )}
        </div>

        {/* Content Editor */}
        <div className="space-y-2">
          <EditorClient content={content} onChange={setContent} />
          {formState.errors.content && (
            <p className="text-destructive text-xs font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              {formState.errors.content[0]}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
