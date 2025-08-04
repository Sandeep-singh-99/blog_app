"use client";
import dynamic from "next/dynamic";
import React, { FormEvent, startTransition, useActionState, useState } from "react";
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
import Image from "next/image";
import { editArticle } from "@/actions/edit-article";
import { Article } from "@prisma/client";

import MDEditor from "@uiw/react-md-editor";



type EditArticleProps = {
    article: Article
}


export default function EditArticle({ article }: EditArticleProps) {
  const [content, setContent] = useState(article?.content || "");
  const [formState, action, isPending] = useActionState(editArticle.bind(null, article.id), {
    errors: {},
  });

   const handleChange = (value?: string) => {
  setContent(value || ''); // Provide a default empty string if value is undefined
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget);
    formData.append("content", content);
    startTransition(() => {
      action(formData)
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Update Article</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                name="title"
                defaultValue={article?.title || ""}
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
              <Select name="category" defaultValue={article?.category || ""} required>
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
              {
                article?.featuredImageUrl && (
                  <div className="">
                    <Image
                      src={article.featuredImageUrl}
                      alt="Featured Image"
                      width={200}
                      height={100}
                      className="w-48 h-32 object-cover"
                    />
                  </div>
                )
              }

              {formState.errors.featuredImageUrl   && (
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
                {isPending ? "Editing..." : "Edit Article"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
