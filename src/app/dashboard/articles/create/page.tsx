import CreateArticle from "@/components/articles/create-article";
import React from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Write New Article",
  description: "Create and publish a new developer article or technical tutorial on BitWrite.",
};

export default function page() {
  return (
    <>
      <CreateArticle />
    </>
  );
}
