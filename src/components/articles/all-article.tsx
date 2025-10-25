import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
import { Search } from "lucide-react";
import Image from "next/image";
import { Prisma } from "@prisma/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import ArticleCard from "./ArticleCard";

type SearchPageProps = {
  articles: Prisma.ArticleGetPayload<{
    include:{
      author:{
        select:{
          name:true,
          email:true,
          imageUrl:true
        }
      }
    }
  }>[];
};

export default function AllArticles({ articles }: SearchPageProps) {
 
  if (articles?.length === 0) return <NoSearchResults />;

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles?.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

export function NoSearchResults() {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {/* Icon */}
      <div className="mb-4 rounded-full bg-muted p-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-foreground">
        No Results Found
      </h3>

      {/* Description */}
      <p className="mt-2 text-muted-foreground">
        We could not find any articles matching your search. Try a different
        keyword or phrase.
      </p>
    </div>
  );
}