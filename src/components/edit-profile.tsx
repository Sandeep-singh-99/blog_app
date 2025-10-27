"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Label } from "./ui/label";
import MDEditor from "@uiw/react-md-editor";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";

export default function EditProfile() {
  const [content, setContent] = useState("");

  const handleChange = (value?: string) => {
    setContent(value || "");
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size={"sm"} className="mt-2">
          Edit Bio
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Edit Profile
          </DialogTitle>
          <DialogDescription>Edit profile form goes here.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="bio" className=" w-full">
          <TabsList className="w-full rounded-lg p-1">
            <TabsTrigger value="bio">Bio</TabsTrigger>
            <TabsTrigger value="social-media">Social Media Link</TabsTrigger>
          </TabsList>

          {/* Bio Tab Content */}
          <TabsContent value="bio">
            <form>
              <div className="mt-2 space-y-2">
                <Label>Bio</Label>
                <MDEditor
                  value={content}
                  onChange={handleChange}
                  height={300}
                />
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant={"secondary"} className="rounded-lg">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="rounded-lg">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="social-media">
            <form className="space-y-4">
              <div className="grid gap-2">
                <Label>Social Media Link</Label>

                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Social Media" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Social Media</SelectLabel>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Social Media URL</Label>
                <Input
                  type="link"
                  placeholder="https://your-link.com"
                />
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant={"secondary"} className="rounded-lg">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="rounded-lg">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
