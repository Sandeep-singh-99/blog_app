import React from 'react'
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto mt-16 px-6">
      {/* LEFT SIDE - POSTS SKELETON */}
      <div className="flex-1">
        {/* Name Skeleton */}
        <Skeleton className="h-10 w-48 mb-6" />

        {/* Tabs / Sub-header Skeleton */}
        <div className="flex gap-4 mb-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Separator className="mb-6" />

        {/* Posts List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex justify-between gap-6 border-b pb-6"
            >
              <div className="flex flex-col gap-2 flex-1">
                {/* Title skeleton */}
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                {/* Meta details skeleton */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                  <Skeleton className="h-4 w-24" />
                  <span>•</span>
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              {/* Image thumbnail skeleton */}
              <Skeleton className="h-[80px] w-[120px] rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - SIDEBAR SKELETON */}
      <aside className="w-full md:w-72">
        <div className="flex flex-col items-center text-center border rounded-xl p-6 shadow-sm">
          {/* Avatar Skeleton */}
          <Skeleton className="h-24 w-24 rounded-full mb-4" />

          {/* Name Skeleton */}
          <Skeleton className="h-6 w-32 mb-2" />
          
          {/* Followers Skeleton */}
          <Skeleton className="h-4 w-20 mb-4" />

          {/* Action button skeleton (e.g. edit / follow) */}
          <Skeleton className="h-9 w-full mb-4" />

          <Separator className="my-4 w-full" />

          {/* Social media links skeleton */}
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </aside>
    </div>
  )
}

