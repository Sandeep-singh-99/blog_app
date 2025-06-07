import AllArticles from "@/components/articles/all-article";
import { AllArticlesPageSkeleton } from "@/components/articles/all-article-skeleton";
import ArticleSearch from "@/components/articles/article-search";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { fetchArticleByQuery } from "@/lib/query/fetch-article";
import Link from "next/link";
import React, { Suspense } from "react";

type SearchPageProps = {
  searchParams: { search?: string; page?: string };
};

const ITEMS_PER_PAGE = 3;

export default async function page({ searchParams }: SearchPageProps) {
  const searchText = searchParams.search || "";
  const currentPage = Number(searchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const take = ITEMS_PER_PAGE;

  const { articles, total } = await fetchArticleByQuery(searchText, skip, take);
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12 sm:px-6 lg:text-5xl">
        <div className="mb-12 space-y-6 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">All Articles</h1>

          {/* Search Bar */}
          <Suspense>
            <ArticleSearch />
          </Suspense>
        </div>

        {/* All Articles */}
        <Suspense fallback={<AllArticlesPageSkeleton />}>
          <AllArticles articles={articles} />
        </Suspense>

        <div className="mt-12 flex justify-center gap-2">
          {/* Prev Button */}
          <Link href={`?search=${searchText}&page=${currentPage - 1}`} passHref>
            <Button variant="ghost" size="sm" disabled={currentPage === 1}>
              ← Prev
            </Button>
          </Link>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <Link
              key={index}
              href={`?search=${searchText}&page=${index + 1}`}
              passHref
            >
              <Button
                variant={`${
                  currentPage === index + 1 ? "destructive" : "ghost"
                }`}
                size="sm"
                disabled={currentPage === index + 1}
              >
                {index + 1}
              </Button>
            </Link>
          ))}

          {/* Next Button */}
          <Link href={`?search=${searchText}&page=${currentPage + 1}`} passHref>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages}
            >
              Next →
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
