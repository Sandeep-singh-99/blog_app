'use client'
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "react-quill-new/dist/quill.snow.css";
import { Button } from "../ui/button";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateArticle() {
  const [content, setContent] = useState("");
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Article</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                name="title"
                placeholder="Enter a title for your article"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Featured Image</Label>
              <Input
              type="file"
              id="featured-image"
              name="featured-image"
              accept="image/*"
              className="w-full"
              placeholder="Upload an image for your article"
              />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Write your article content here..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button variant={"outline"}>Cancel</Button>
              <Button type="submit">Publish Article</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
