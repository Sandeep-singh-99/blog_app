"use client";
import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
  KeyboardEvent,
  ChangeEvent,
  useEffect
} from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";
import { createArticle } from "@/actions/create-article";
import { toast } from "sonner";
import { X, Image as ImageIcon, Sparkles, FolderOpen, Tag, ArrowLeft, UploadCloud } from "lucide-react";
import EditorClient from "../Editor/EditorClient";
import { useRouter } from "next/navigation";
import { countWords } from "@/lib/utils";

export default function CreateArticle() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const [formState, action, isPending] = useActionState(createArticle, {
    errors: {},
  });

  // Watch for successful action and redirect/notify
  useEffect(() => {
    if (formState.success) {
      toast.success("Article created successfully!");
      router.push("/dashboard");
    } else if (formState.errors.formErrors?.length) {
      toast.error(formState.errors.formErrors[0]);
    }
  }, [formState, router]);

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB.");
        e.target.value = "";
        setImagePreview(null);
        return;
      }
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("featuredImageUrl") as File | null;

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    if (!imageFile || imageFile.name === "undefined" || imageFile.size === 0) {
      toast.error("Featured cover image is required.");
      return;
    }

    if (!content || content.trim().length < 10) {
      toast.error("Content is too short (min 10 characters).");
      return;
    }

    const wordCount = countWords(content);
    if (wordCount > 5000) {
      toast.error(`Content exceeds the maximum limit of 5000 words (current: ${wordCount} words).`);
      return;
    }

    if (tags.length === 0) {
      toast.error("At least one tag is required.");
      return;
    }

    formData.append("content", content);
    formData.append("tags", tags.join(","));
    
    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="text-muted-foreground hover:text-foreground h-9 px-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <div className="h-4 w-[1px] bg-border hidden sm:block" />
            <h1 className="text-2xl font-bold tracking-tight">Write a New Story</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
              Draft
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              disabled={isPending}
              className="h-10 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-10 px-5 gap-2 bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm transition-all"
            >
              {isPending ? (
                <>Creating...</>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Publish Story
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="space-y-2">
          <div className="relative group rounded-xl overflow-hidden border-2 border-dashed border-muted hover:border-primary/50 transition-all duration-300 bg-muted/20 aspect-[21/9] flex items-center justify-center">
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Cover Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
                  <Button
                    type="button"
                    variant="secondary"
                    className="gap-2"
                    onClick={() => document.getElementById("featuredImageUrl")?.click()}
                  >
                    <ImageIcon className="h-4 w-4" /> Change Cover
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="gap-2"
                    onClick={() => {
                      setImagePreview(null);
                      const fileInput = document.getElementById("featuredImageUrl") as HTMLInputElement;
                      if (fileInput) fileInput.value = "";
                    }}
                  >
                    <X className="h-4 w-4" /> Remove
                  </Button>
                </div>
              </>
            ) : (
              <div
                className="text-center p-6 flex flex-col items-center gap-3 cursor-pointer w-full h-full justify-center"
                onClick={() => document.getElementById("featuredImageUrl")?.click()}
              >
                <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center shadow-sm border border-border text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Add a featured cover image</p>
                  <p className="text-xs text-muted-foreground mt-1">Drag & drop or click to upload (Max 5MB)</p>
                </div>
              </div>
            )}
            <input
              type="file"
              id="featuredImageUrl"
              name="featuredImageUrl"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          {formState.errors.featuredImageUrl && (
            <p className="text-destructive text-sm font-medium mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              {formState.errors.featuredImageUrl[0]}
            </p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <input
            type="text"
            name="title"
            placeholder="Title of your story..."
            className="w-full text-4xl md:text-5xl font-extrabold bg-transparent border-none outline-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/30 py-2 tracking-tight"
            required
            autoFocus
          />
          {formState.errors.title && (
            <p className="text-destructive text-sm font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              {formState.errors.title[0]}
            </p>
          )}
        </div>

        {/* Metadata Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
              <FolderOpen className="h-4 w-4" /> Category
            </Label>
            <Select name="category" defaultValue="" required>
              <SelectTrigger className="w-full h-11 bg-background/50 border-border hover:bg-accent/30 transition-colors" name="category" id="category">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent id="category">
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="App Development">App Development</SelectItem>
                <SelectItem value="Software Development">Software Development</SelectItem>
              </SelectContent>
            </Select>
            {formState.errors.category && (
              <p className="text-destructive text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
                {formState.errors.category[0]}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold flex items-center gap-1.5 text-muted-foreground">
              <Tag className="h-4 w-4" /> Tags
            </Label>
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 min-h-11 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-semibold text-primary animate-in fade-in zoom-in-95 duration-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-primary hover:text-primary-foreground hover:bg-primary rounded-full p-0.5 transition-all cursor-pointer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Type tag & press Enter..." : "Add tag..."}
                className="border-none outline-none focus:ring-0 p-0 text-sm flex-1 bg-transparent placeholder:text-muted-foreground/50 min-w-[120px]"
              />
            </div>
            {formState.errors.tags && (
              <p className="text-destructive text-sm font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
                {formState.errors.tags[0]}
              </p>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="space-y-2 pt-4">
          <Label className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
            Content
          </Label>
          <EditorClient content={content} onChange={setContent} />
          {formState.errors.content && (
            <p className="text-destructive text-sm font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
              {formState.errors.content[0]}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
