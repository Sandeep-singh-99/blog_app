"use client";
import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
  KeyboardEvent
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
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

import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function CreateArticle() {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formState, action, isPending] = useActionState(createArticle, {
    errors: {},
  });

  const handleChange = (value?: string) => {
    setContent(value || "");
  };

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const imageFile = formData.get("featuredImageUrl") as File | null;

    if (imageFile && imageFile.size > 1 * 1024 * 1024) {
      // 1MB limit
      toast.error("Image must be less than 1MB.");
      return; 
    }

    formData.append("content", content);
    formData.append("tags", tags.join(","));
    startTransition(() => {
      action(formData);
      toast.success("Article created successfully!");
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                name="title"
                placeholder="Enter a title for your article"
              />
              {formState.errors.title && (
                <span className="text-red-500 text-sm">
                  {formState.errors.title}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue="" required>
                <SelectTrigger className="w-full" name="category" id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent id="category">
                  <SelectItem value="Web Development">
                    Web Development
                  </SelectItem>
                  <SelectItem value="App Development">
                    App Development
                  </SelectItem>
                  <SelectItem value="Software Development">
                    Software Development
                  </SelectItem>
                </SelectContent>
              </Select>
              {formState.errors.category && (
                <span className="text-red-500 text-sm">
                  {formState.errors.category}
                </span>
              )}
            </div>

        {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                <Input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type and press Enter..."
                  className="border-0 p-0 focus-visible:ring-0 flex-1 bg-transparent"
                />
              </div>
              {formState.errors.tags && (
                <span className="text-red-500 text-sm">
                  {formState.errors.tags}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <Input
                type="file"
                id="featuredImageUrl"
                name="featuredImageUrl"
                accept="image/*"
                className="w-full"
                placeholder="Upload an image for your article"
              />
              {formState.errors.featuredImageUrl && (
                <span className="text-red-500 text-sm">
                  {formState.errors.featuredImageUrl}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <MDEditor value={content} onChange={handleChange} />
              {formState.errors.content && (
                <span className="text-red-500 text-sm">
                  {formState.errors.content}
                </span>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant={"outline"}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
