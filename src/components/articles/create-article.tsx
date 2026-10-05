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
import { createArticle } from "@/actions/create-article";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Lock,
  Calendar,
  Clock,
  Sparkles,
  Smile,
  ImageIcon,
  X,
  ChevronRight,
  FileText,
} from "lucide-react";
import EditorClient from "../Editor/EditorClient";
import { useRouter } from "next/navigation";
import { countWords } from "@/lib/utils";

const NOTION_ICONS = ["📝", "💡", "🚀", "📌", "⚡", "🎯", "📚", "🧠", "💻", "🎨", "📋", "📂", "🔥", "✨"];

const COVER_GRADIENTS = [
  { name: "Aurora", class: "from-indigo-500/20 via-purple-500/15 to-pink-500/20" },
  { name: "Ocean", class: "from-cyan-500/20 via-blue-500/15 to-indigo-500/20" },
  { name: "Sunset", class: "from-amber-500/20 via-orange-500/15 to-rose-500/20" },
  { name: "Emerald", class: "from-emerald-500/20 via-teal-500/15 to-cyan-500/20" },
  { name: "Slate", class: "from-slate-500/20 via-zinc-500/15 to-stone-500/20" },
];

export default function CreateArticle() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState<string | null>("📝");
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [coverIndex, setCoverIndex] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Notion Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-border/50 pb-3">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-muted-foreground">
            <button
              type="button"
              onClick={() => router.push("/dashboard/notes")}
              className="hover:text-slate-900 dark:hover:text-foreground flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Notes</span>
            </button>
            <ChevronRight className="h-3 w-3 opacity-40" />
            <span className="text-slate-900 dark:text-foreground font-semibold truncate max-w-[200px]">
              {title || "Untitled"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-muted-foreground mr-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Draft</span>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard/notes")}
              disabled={isPending}
              className="h-8 px-2.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground"
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
                  <span>Save Note</span>
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
          <div className="relative group rounded-2xl overflow-hidden h-36 sm:h-44 w-full bg-gradient-to-r border border-slate-200/80 dark:border-border/40 transition-all duration-300">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${COVER_GRADIENTS[coverIndex].class}`}
            />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                type="button"
                onClick={() =>
                  setCoverIndex((prev) => (prev + 1) % COVER_GRADIENTS.length)
                }
                className="rounded-lg bg-white/90 dark:bg-background/80 hover:bg-white dark:hover:bg-background px-2.5 py-1 text-[11px] font-medium backdrop-blur-md border border-slate-200 dark:border-border/60 shadow-xs transition-colors text-slate-800 dark:text-foreground"
              >
                Change Style ({COVER_GRADIENTS[coverIndex].name})
              </button>
              <button
                type="button"
                onClick={() => setShowCover(false)}
                className="rounded-lg bg-white/90 dark:bg-background/80 hover:bg-white dark:hover:bg-background p-1 text-[11px] font-medium backdrop-blur-md border border-slate-200 dark:border-border/60 shadow-xs transition-colors text-slate-800 dark:text-foreground"
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
              className="hover:text-slate-900 dark:hover:text-foreground inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-muted/50 transition-colors"
            >
              <Smile className="h-3.5 w-3.5" />
              <span>Add icon</span>
            </button>
          )}

          {!showCover && (
            <button
              type="button"
              onClick={() => setShowCover(true)}
              className="hover:text-slate-900 dark:hover:text-foreground inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-muted/50 transition-colors"
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
                    className="h-8 w-8 text-lg rounded-lg hover:bg-slate-100 dark:hover:bg-muted/80 flex items-center justify-center transition-colors"
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
                  className="w-full text-xs text-slate-500 hover:text-destructive pt-1 text-center font-medium border-t border-slate-200 dark:border-border/50 mt-1"
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

        {/* Notion Properties Block */}
        <div className="space-y-2 py-2.5 border-y border-slate-200/80 dark:border-border/40 text-xs text-slate-500 dark:text-muted-foreground font-sans">
          <div className="flex items-center gap-6">
            <div className="w-24 flex items-center gap-1.5 opacity-75">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created</span>
            </div>
            <span className="text-slate-800 dark:text-foreground/90 font-medium">
              {new Date().toLocaleDateString("en-US", {
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
