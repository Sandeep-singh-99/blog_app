"use client";

import React, {
  FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
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
import { createBio } from "@/actions/create-bio";
import { toast } from "sonner";
import { createSocialLink } from "@/actions/create-social-link";
import { deleteSocialMedia } from "@/actions/delete-social-media";

type SocialLink = {
  id?: string;
  socialMediaName: string;
  url: string;
};

type EditProfileProps = {
  existingBio?: string;
  existingLinks?: SocialLink[];
};

export default function EditProfile({
  existingBio = "",
  existingLinks = [],
}: EditProfileProps) {
  const [content, setContent] = useState(existingBio);
//   const existing = existingLinks[0] || { socialMediaName: "", url: "" }
  const [socialMediaName, setSocialMediaName] = useState("");
  const [url, setUrl] = useState("");
  const [formState, action, isPending] = useActionState(createBio, {
    errors: {},
  });

  const [socialFormState, socialAction, isPendingSocial] = useActionState(
    createSocialLink,
    {
      errors: {},
    }
  );

  const handleBioSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    formData.append("bio", content);

    startTransition(() => {
      action(formData);
      toast.success("Bio updated successfully!");
    });
  };

  const handleSocialSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    formData.append("socialMediaName", socialMediaName);
    formData.append("url", url);

    startTransition(() => {
      socialAction(formData);
      toast.success("Social media link updated successfully!");
    });
  };

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
            <form onSubmit={handleBioSubmit}>
              <div className="mt-2 space-y-2">
                <Label>Bio</Label>
                <MDEditor
                  value={content}
                  onChange={handleChange}
                  height={300}
                />
                {formState.errors.bio && (
                  <span className="text-red-500 text-sm">
                    {formState.errors.bio}
                  </span>
                )}
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant={"secondary"} className="rounded-lg">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="rounded-lg"
                  disabled={isPending}
                >
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="social-media">
            <form className="space-y-4" onSubmit={handleSocialSubmit}>
              <div className="grid gap-2">
                <Label>Social Media Link</Label>

                <Select
                  value={socialMediaName}
                  onValueChange={setSocialMediaName}
                >
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
                {socialFormState.errors.socialMediaName && (
                  <span className="text-red-500 text-sm">
                    {socialFormState.errors.socialMediaName}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Social Media URL</Label>
                <Input
                  type="url"
                  placeholder="https://your-link.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                {socialFormState.errors.url && (
                  <span className="text-red-500 text-sm">
                    {socialFormState.errors.url}
                  </span>
                )}
              </div>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant={"secondary"} className="rounded-lg">
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="rounded-lg"
                  disabled={isPendingSocial}
                >
                  {isPendingSocial ? "Saving..." : "Save"}
                </Button>
              </DialogFooter>
            </form>

            {/* 🧠 Show Saved Social Links */}
            {existingLinks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">
                  Your Social Links
                </h3>
                <div className="space-y-3">
                  {existingLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="capitalize font-medium">
                          {link.socialMediaName}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {link.url}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSocialMediaName(link.socialMediaName);
                            setUrl(link.url);
                            toast.info(`Editing ${link.socialMediaName}`);
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={async () => {
                            const confirmDelete = confirm(
                              `Are you sure you want to delete ${link.socialMediaName}?`
                            );
                            if (!confirmDelete) return;

                            const result = await deleteSocialMedia(link.id!);
                            if (result.success) {
                              toast.success(
                                `${link.socialMediaName} deleted successfully!`
                              );
                            } else {
                              toast.error(result.message);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
