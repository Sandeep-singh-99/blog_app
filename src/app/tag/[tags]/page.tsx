import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

type TagPageProps = {
  params: { tag: string };
};

export default async function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.tag);
  console.log("Tag param:", tag); // should log the clicked tag

  const articles = await prisma.article.findMany({
    where: { tags: { has: tag } }, // Prisma array contains
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  console.log("Tag Article", articles);
  

  if (articles.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-10 text-center text-muted-foreground">
        No articles found with tag <b>{tag}</b>.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">
        Articles tagged with <span className="text-blue-600">#{tag}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {articles.map((article) => (
          <Link
            href={`/article/${article.id}`}
            key={article.id}
            className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
          >
            {article.featuredImageUrl && (
              <Image
                src={article.featuredImageUrl}
                alt={article.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mt-1">
                {article.content.replace(/[#_*`>]/g, "").slice(0, 120)}...
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                By {article.author.name} • {new Date(article.createdAt).toDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
