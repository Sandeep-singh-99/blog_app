import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-10 animate-fade-in">
        <article className="mx-auto max-w-4xl rounded-2xl">
          {/* Featured Image Skeleton */}
          <div className="relative h-[250px] md:h-[420px] overflow-hidden rounded-t-2xl">
            <Skeleton className="h-full w-full rounded-t-2xl" />
          </div>

          <div className="py-5">
            {/* Category Badge Skeleton */}
            <Skeleton className="mb-4 h-6 w-20 rounded-full" />

            {/* Title Skeleton */}
            <div className="space-y-3 mb-8">
              <Skeleton className="h-10 w-full rounded-lg md:h-12" />
              <Skeleton className="h-10 w-3/4 rounded-lg md:h-12" />
            </div>

            {/* Author Card Skeleton */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                {/* Avatar Skeleton */}
                <Skeleton className="h-14 w-14 rounded-full border-2 border-white shadow-sm" />

                <div className="space-y-2">
                  {/* Name Skeleton */}
                  <Skeleton className="h-5 w-32 rounded" />
                  {/* Published Date Skeleton */}
                  <Skeleton className="h-4 w-48 rounded" />
                </div>
              </div>

              {/* Follow Button Skeleton */}
              <Skeleton className="h-10 w-24 rounded-lg self-start md:self-auto" />
            </div>

            {/* Content Skeleton */}
            <div className="mt-8 space-y-6">
              {/* Paragraph 1 */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-[98%] rounded" />
                <Skeleton className="h-4 w-[95%] rounded" />
                <Skeleton className="h-4 w-[92%] rounded" />
                <Skeleton className="h-4 w-[60%] rounded" />
              </div>

              {/* Paragraph 2 (with embedded image / block placeholder) */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-[99%] rounded" />
                <Skeleton className="h-4 w-[97%] rounded" />
                <Skeleton className="h-4 w-[94%] rounded" />
                {/* Visual Block Representation */}
                <Skeleton className="my-6 h-64 w-full rounded-xl md:h-80" />
                <Skeleton className="h-4 w-[96%] rounded" />
                <Skeleton className="h-4 w-[90%] rounded" />
                <Skeleton className="h-4 w-[45%] rounded" />
              </div>

              {/* Paragraph 3 */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-[98%] rounded" />
                <Skeleton className="h-4 w-[85%] rounded" />
              </div>
            </div>

            {/* Actions Skeleton (Like, Bookmark, Share) */}
            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-6">
              <Skeleton className="h-10 w-24 rounded-full" /> {/* Like button */}
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Bookmark button */}
              <Skeleton className="h-10 w-10 rounded-full" /> {/* Share button */}
            </div>

            {/* Comments Section Skeleton */}
            <div className="mt-5 border-t border-gray-200 pt-10">
              {/* Comment Input */}
              <Skeleton className="h-28 w-full rounded-xl" />

              {/* Comments list */}
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-4 w-full rounded" />
                    <Skeleton className="h-4 w-[85%] rounded" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-28 rounded" />
                    <Skeleton className="h-4 w-[90%] rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
