import React from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export default function TopArticle() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <Card
        className={cn(
          "group relative overflow-hidden transition-all hover:scale-[1.02]",
          "border border-gray-200/50 dark:border-white/10",
          "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg"
        )}
      >
        <div className="p-6">
          <Link href={""}>
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
              <Image
                src="https://images.unsplash.com/photo-1485988412941-77a35537dae4?q=80&w=2992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Article Image"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={
                    "https://images.unsplash.com/photo-1502685104226-1c2b8f0d3a4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=64&h=64&q=80"
                  }
                  alt="Author Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>Sandeep Singh</span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              How to Build a Blog with Next.js
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              A comprehensive guide to building a modern blog using Next.js,
              covering setup, styling, and deployment.
            </p>

            <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>12 Feb</span>
              <span>2024</span>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
