import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import Link from "next/link";
import DeleteBtn from "./delete-btn";
import { Prisma } from "@prisma/client";

type RecentArticleProps = {
  articles: Prisma.ArticleGetPayload<{
    include: {
      comments: true;
      author: {
        select: {
          name: true;
          email: true;
          imageUrl: true;
        };
      };
    };
  }>[];
};

export default function RecentArticle({ articles }: RecentArticleProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Articles</CardTitle>
          <Button
            className="text-muted-foreground "
            size={"sm"}
            variant={"ghost"}
          >
            View All
          </Button>
        </div>
      </CardHeader>

      {!articles.length ? (
        <CardContent>No recent articles found.</CardContent>
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={"secondary"}
                      className="rounded-full bg-green-100 text-green-800"
                    >
                      published
                    </Badge>
                  </TableCell>
                  <TableCell>{article.comments.length}</TableCell>
                  <TableCell>
                    {article.createdAt.toISOString().split("T")[0]}
                  </TableCell>
                  <TableCell>
                    <div>
                      <Link href={`/dashboard/articles/${article.id}/edit`}>
                        <Button variant={"ghost"} size={"sm"}>
                          Edit
                        </Button>
                      </Link>
                      <DeleteBtn />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
}
