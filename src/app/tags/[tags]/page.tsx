import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TagPageProps = {
  params: { tags: string };
};

export default async function TagPage({ params }: TagPageProps) {
  const { tags } = await params;
  const tag = decodeURIComponent(tags);
  
  const articles = await prisma.article.findMany({
    where: { tags: { has: tag } }, 
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });
  

  if (articles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center text-muted-foreground">
        No articles found with tag <b>{tag}</b>.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">
        Articles tagged with <span className="text-blue-600">#{tag}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Card
          key={article.id}
          className={cn(
            "group relative overflow-hidden transition-all hover:scale-[1.02]",
            "border border-gray-200/50 dark:border-white/10",
            "bg-white/50 dark:bg-gray-900/50 backdrop-blur-lg"
          )}
        >
          <div className="p-6">
            <Link href={`/articles/${article.id}`} className="flex flex-col">
              <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl">
                <Image
                  src={article.featuredImageUrl}
                  alt="Article Image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={article.author.imageUrl || ""}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{article.author.name}</span>
              </div>

              <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {article.title}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                {article.category}
              </p>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{article.createdAt.toISOString().split("T")[0]}</span>
                <span>{article.createdAt.getFullYear()}</span>
              </div>
            </Link>
          </div>
        </Card>
        ))}
      </div>
    </div>
  );
}
