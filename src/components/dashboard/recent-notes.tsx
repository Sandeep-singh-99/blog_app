import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
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
import { FileText, PlusCircle, ExternalLink, Edit3, Lock, Calendar, Eye } from "lucide-react";

type RecentNotesProps = {
  notes: Prisma.ArticleGetPayload<{
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

export default function RecentNotes({ notes }: RecentNotesProps) {
  return (
    <Card className="border border-border/80 shadow-xs hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <span>Recent Knowledge Notes</span>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Your most recently captured markdown notes, documents, and research
          </CardDescription>
        </div>
        <Link href="/dashboard/notes/create">
          <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-semibold">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Note</span>
          </Button>
        </Link>
      </CardHeader>

      {!notes.length ? (
        <CardContent className="py-12 text-center space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <FileText className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">No notes found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Your personal knowledge workspace is ready. Capture your first thought,
              architecture decision, or meeting summary.
            </p>
          </div>
          <Link href="/dashboard/notes/create">
            <Button size="sm" className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
              Create First Note
            </Button>
          </Link>
        </CardContent>
      ) : (
        <CardContent className="p-0 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="text-xs font-bold">Note Title</TableHead>
                  <TableHead className="text-xs font-bold">Category</TableHead>
                  <TableHead className="text-xs font-bold">Security</TableHead>
                  <TableHead className="text-xs font-bold">Updated</TableHead>
                  <TableHead className="text-xs font-bold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {notes.map((note) => {
                  return (
                    <TableRow key={note.id} className="hover:bg-muted/40 transition-colors border-border/50">
                      <TableCell className="font-semibold text-foreground max-w-[260px]">
                        <Link
                          href={`/dashboard/notes/${note.id}`}
                          className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 shrink-0" />
                          <span className="truncate group-hover:underline" title={note.title}>
                            {note.title}
                          </span>
                        </Link>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="rounded-md font-mono text-[10px] bg-muted text-foreground border border-border/60 uppercase"
                        >
                          {note.category || "General"}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <Lock className="h-3 w-3" />
                          <span>Private</span>
                        </span>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground font-mono">
                        {new Date(note.updatedAt || note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/dashboard/notes/${note.id}`}>
                            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs gap-1 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40">
                              <Eye className="h-3.5 w-3.5" />
                              <span>View</span>
                            </Button>
                          </Link>
                          <Link href={`/dashboard/notes/${note.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs gap-1 hover:text-indigo-600">
                              <Edit3 className="h-3.5 w-3.5" />
                              <span>Edit</span>
                            </Button>
                          </Link>
                          <DeleteBtn articleId={note.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
