"use client";
import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
  useEffect,
  useRef,
} from "react";
import { Button } from "../ui/button";
import { editArticle } from "@/actions/edit-article";
import { Article } from "@prisma/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Lock,
  Calendar,
  Clock,
  Smile,
  ImageIcon,
  X,
  ChevronRight,
  History,
} from "lucide-react";
import EditorClient from "../Editor/EditorClient";
import { useRouter } from "next/navigation";
import { countWords } from "@/lib/utils";

const NOTION_ICONS = ["📝", "💡", "🚀", "📌", "⚡", "🎯", "📚", "🧠", "💻", "🎨", "📋", "📂", "🔥", "✨"];

const COVER_COLORS = [
  { name: "Indigo", class: "bg-indigo-500/15 border-indigo-500/30" },
  { name: "Cyan", class: "bg-cyan-500/15 border-cyan-500/30" },
  { name: "Amber", class: "bg-amber-500/15 border-amber-500/30" },
  { name: "Emerald", class: "bg-emerald-500/15 border-emerald-500/30" },
  { name: "Slate", class: "bg-slate-500/15 border-slate-500/30" },
];

type EditArticleProps = {
  article: Article & {
    parent?: {
      id: string;
      title: string;
    } | null;
  };
};

export default function EditArticle({ article }: EditArticleProps) {
  const router = useRouter();

  const [content, setContent] = useState(article?.content || "");
  const [title, setTitle] = useState(article?.title || "");
  const [icon, setIcon] = useState<string | null>("📝");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);

  const [formState, action, isPending] = useActionState(
    editArticle.bind(null, article.id),
    {
      errors: {},
    }
  );

  // Watch for successful action and redirect/notify
  useEffect(() => {
    if (formState.success) {
      window.dispatchEvent(new Event("notes-updated"));
      toast.success("Note updated successfully!");
      if (formState.updatedNoteId) {
        router.push(`/dashboard/notes/${formState.updatedNoteId}`);
      } else {
        router.push(`/dashboard/notes/${article.id}`);
      }
    } else if (formState.errors.formErrors?.length) {
      toast.error(formState.errors.formErrors[0]);
    }
  }, [formState, router, article.id]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (formRef.current) {
          formRef.current.requestSubmit();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle || cleanTitle.length < 1) {
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

    const formData = new FormData();
    formData.set("title", cleanTitle);
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

  const isSubNote = !!article.parentId;
  const parentTitle = article.parent?.title;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Notion Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-border/50 pb-3">
          {/* Clean Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground flex-wrap">
            <button
              type="button"
              onClick={() => router.push("/dashboard/notes")}
              className="hover:text-slate-900 dark:hover:text-foreground flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Notes</span>
            </button>

            {parentTitle && article.parent && (
              <>
                <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/notes/${article.parent?.id}`)}
                  className="hover:text-slate-900 dark:hover:text-foreground font-medium truncate max-w-[140px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  title={`Parent note: ${parentTitle}`}
                >
                  {parentTitle}
                </button>
              </>
            )}

            <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
            <button
              type="button"
              onClick={() => router.push(`/dashboard/notes/${article.id}`)}
              className="text-slate-900 dark:text-foreground font-semibold truncate max-w-[180px] hover:underline cursor-pointer"
              title={title}
            >
              {title || (isSubNote ? "Untitled Subnote" : "Untitled")}
            </button>
            <span className="text-[11px] text-muted-foreground font-normal ml-0.5">
              (Editing)
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-muted-foreground mr-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span>{isSubNote ? "Editing Subnote" : "Editing Note"}</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/dashboard/notes/${article.id}`)}
              disabled={isPending}
              className="h-8 px-2.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="h-8 px-3.5 gap-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs transition-all cursor-pointer"
            >
              {isPending ? (
                <>Saving...</>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Save Changes</span>
                  <span className="hidden sm:inline-block ml-1 opacity-60 text-[10px] font-mono">
                    ⌘S
                  </span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Notion Optional Cover */}
        {showCover && (
          <div className={`relative group rounded-2xl overflow-hidden h-36 sm:h-44 w-full border transition-all duration-300 ${COVER_COLORS[coverIndex].class}`}>
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                type="button"
                onClick={() =>
                  setCoverIndex((prev) => (prev + 1) % COVER_COLORS.length)
                }
                className="rounded-lg bg-white/90 dark:bg-background/80 hover:bg-white dark:hover:bg-background px-2.5 py-1 text-[11px] font-medium backdrop-blur-md border border-slate-200 dark:border-border/60 shadow-xs transition-colors text-slate-800 dark:text-foreground cursor-pointer"
              >
                Change Style ({COVER_COLORS[coverIndex].name})
              </button>
              <button
                type="button"
                onClick={() => setShowCover(false)}
                className="rounded-lg bg-white/90 dark:bg-background/80 hover:bg-white dark:hover:bg-background p-1 text-[11px] font-medium backdrop-blur-md border border-slate-200 dark:border-border/60 shadow-xs transition-colors text-slate-800 dark:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Notion Hover Controls (Add Icon / Add Cover) */}
        <div className="flex items-center gap-2 pt-1 text-xs text-slate-500 dark:text-muted-foreground/70">
          {!icon && (
            <button
              type="button"
              onClick={() => setIcon("📝")}
              className="hover:text-slate-900 dark:hover:text-foreground inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <Smile className="h-3.5 w-3.5" />
              <span>Add icon</span>
            </button>
          )}

          {!showCover && (
            <button
              type="button"
              onClick={() => setShowCover(true)}
              className="hover:text-slate-900 dark:hover:text-foreground inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Add cover</span>
            </button>
          )}
        </div>

        {/* Notion Page Icon Display & Picker */}
        {icon && (
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="text-4xl sm:text-5xl hover:scale-105 active:scale-95 transition-transform p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-muted/40 cursor-pointer"
              title="Click to change icon"
            >
              {icon}
            </button>

            {showIconPicker && (
              <div className="absolute top-full left-0 mt-2 z-30 p-2 rounded-xl border border-slate-200 dark:border-border/80 bg-white dark:bg-popover text-slate-800 dark:text-popover-foreground shadow-lg flex flex-wrap gap-1.5 w-64 animate-in fade-in zoom-in-95 duration-150">
                {NOTION_ICONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setIcon(item);
                      setShowIconPicker(false);
                    }}
                    className="h-8 w-8 text-lg rounded-lg hover:bg-slate-100 dark:hover:bg-muted/80 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIcon(null);
                    setShowIconPicker(false);
                  }}
                  className="w-full text-xs text-slate-500 hover:text-destructive pt-1 text-center font-medium border-t border-slate-200 dark:border-border/50 mt-1 cursor-pointer"
                >
                  Remove icon
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notion Page Title */}
        <div className="space-y-1">
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                (window as any).editor?.commands?.focus();
              }
            }}
            placeholder="Untitled"
            className="w-full text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-foreground bg-transparent border-none outline-none focus:outline-none placeholder:text-slate-300 dark:placeholder:text-muted-foreground/30 p-0"
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

        {/* Notion Properties Block - Clean & Minimalist */}
        <div className="space-y-2 py-2.5 border-y border-slate-200/80 dark:border-border/40 text-xs text-slate-500 dark:text-muted-foreground font-sans">
          <div className="flex items-center gap-6">
            <div className="w-24 flex items-center gap-1.5 opacity-75">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created</span>
            </div>
            <span className="text-slate-800 dark:text-foreground/90 font-medium">
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 flex items-center gap-1.5 opacity-75">
              <History className="h-3.5 w-3.5" />
              <span>Updated</span>
            </div>
            <span className="text-slate-800 dark:text-foreground/90 font-medium">
              {new Date(article.updatedAt || article.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 flex items-center gap-1.5 opacity-75">
              <Lock className="h-3.5 w-3.5" />
              <span>Access</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-transparent px-2 py-0.5 rounded-md">
              Private Note
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="w-24 flex items-center gap-1.5 opacity-75">
              <Clock className="h-3.5 w-3.5" />
              <span>Reading</span>
            </div>
            <span className="text-slate-700 dark:text-foreground/80 font-mono text-[11px]">
              {wordCount} words • ~{readTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* Notion Rich Text Content Editor */}
        <div className="space-y-2 pt-2">
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
