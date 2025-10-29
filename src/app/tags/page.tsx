import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Tag } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AllTags() {
  const articles = await prisma.article.findMany({
    select: { tags: true },
  });

  const tags = [...new Set(articles.flatMap((a) => a.tags))];

  if (tags.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <Tag className="inline-block h-5 w-5 mr-1 text-muted-foreground" />
        No tags found.
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto py-5 px-4">
      <div className="flex flex-wrap justify-center gap-3">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            // href={`/tags/${tag}`}
            className="group relative flex items-center gap-2 rounded-full border border-border/50 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-purple-500/10"
          >
            <Tag className="h-4 w-4 text-primary transition-colors group-hover:text-purple-600" />
            <span className="capitalize">{tag}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
