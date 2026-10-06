"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BookOpen, ExternalLink, Download, FileText } from "lucide-react";

interface PdfViewerModalProps {
  document: {
    id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    fileSize: number | null;
    category: string | null;
    summary: string | null;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PdfViewerModal({
  document: doc,
  open,
  onOpenChange,
}: PdfViewerModalProps) {
  if (!doc) return null;

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] p-4 sm:p-6 bg-background/95 backdrop-blur-xl border-border/80">
        <DialogHeader className="pb-3 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pr-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base font-bold text-foreground truncate max-w-md sm:max-w-lg">
                  {doc.title}
                </DialogTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="font-mono text-[11px]">{formatFileSize(doc.fileSize)}</span>
                  <span>•</span>
                  <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-medium text-foreground">
                    #{doc.category || "General"}
                  </span>
                  <span>•</span>
                  <span className="truncate max-w-[150px]">{doc.fileName}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold border border-border/70 hover:bg-muted text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in Tab</span>
              </a>
              <a
                href={doc.fileUrl}
                download={doc.fileName}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        </DialogHeader>

        {doc.summary && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground mr-1">Summary:</strong>
            {doc.summary}
          </div>
        )}

        {/* Embedded PDF Viewer */}
        <div className="relative w-full h-[65vh] rounded-xl border border-border/70 overflow-hidden bg-muted/20">
          <iframe
            src={`${doc.fileUrl}#toolbar=1&view=FitH`}
            title={doc.title}
            className="w-full h-full border-0 rounded-xl"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
