"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileUp,
  FileText,
  Search,
  BookOpen,
  Download,
  Trash2,
  Eye,
  Plus,
  Sparkles,
  Layers,
  Filter,
  CheckCircle2,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { UploadDocumentDialog } from "./upload-document-dialog";
import { PdfViewerModal } from "./pdf-viewer-modal";
import { deleteDocument } from "@/actions/delete-document";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface SerializedDocument {
  id: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number | null;
  fileType: string;
  pages: number | null;
  category: string | null;
  summary: string | null;
  createdAt: string; // ISO string for client serialization
}

interface DocumentsClientProps {
  initialDocuments: SerializedDocument[];
}

export function DocumentsClient({ initialDocuments }: DocumentsClientProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<SerializedDocument[]>(initialDocuments);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [previewDoc, setPreviewDoc] = useState<SerializedDocument | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync state if initialDocuments changes via SSR/revalidation
  React.useEffect(() => {
    setDocuments(initialDocuments);
  }, [initialDocuments]);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(documents.map((d) => d.category || "General")))];

  // Filter documents by search and category
  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (d.summary && d.summary.toLowerCase().includes(search.toLowerCase())) ||
      (d.category && d.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "All" || (d.category || "General") === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    const prev = [...documents];
    setDocuments((current) => current.filter((d) => d.id !== id));

    try {
      const res = await deleteDocument(id);
      if (res.success) {
        toast.success(`"${title}" deleted successfully.`);
        if (previewDoc?.id === id) setPreviewDoc(null);
        router.refresh();
      } else {
        setDocuments(prev);
        toast.error(res.error || "Failed to delete document.");
      }
    } catch {
      setDocuments(prev);
      toast.error("An error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")) {
        setDroppedFile(f);
        setUploadDialogOpen(true);
      } else {
        toast.error("Please drop a valid PDF file.");
      }
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const totalBytes = documents.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              PDFs & Technical Documents
            </h1>
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              {documents.length} {documents.length === 1 ? "File" : "Files"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Store, view, and organize technical whitepapers, research notes, and PDF manuals.
          </p>
        </div>

        <Button
          onClick={() => {
            setDroppedFile(null);
            setUploadDialogOpen(true);
          }}
          className="h-9 gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          <FileUp className="h-4 w-4" />
          <span>Upload PDF</span>
        </Button>
      </div>

      {/* Quick Upload Dropzone Banner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleBannerDrop}
        onClick={() => {
          setDroppedFile(null);
          setUploadDialogOpen(true);
        }}
        className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 p-6 text-center hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-500 group-hover:scale-110 transition-transform">
            <FileUp className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            Click to upload or drag & drop a PDF document
          </h3>
          <p className="text-xs text-muted-foreground">
            Supports PDF files up to 25MB • Stored in cloud storage with instant in-browser reader
          </p>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by title, file name, or topic..."
            className="pl-9 h-10 rounded-xl text-xs bg-card border-border/80"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-600 text-white shadow-xs font-semibold"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group bg-card/60 backdrop-blur-sm"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500 font-bold text-xs">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <CardTitle
                        className="text-sm font-bold text-foreground truncate max-w-[190px]"
                        title={doc.title}
                      >
                        {doc.title}
                      </CardTitle>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {formatFileSize(doc.fileSize)} • {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-md bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                    #{doc.category || "General"}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {doc.summary ? (
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {doc.summary}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground/70 italic line-clamp-1">
                    Filename: {doc.fileName}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1 border-t border-border/50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 text-xs h-8 rounded-lg gap-1.5 cursor-pointer hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Read PDF</span>
                  </Button>

                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === doc.id}
                    onClick={() => handleDelete(doc.id, doc.title)}
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-500 mb-3">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">
            {search ? "No matching documents found" : "No PDF documents yet"}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm">
            {search
              ? `No documents match "${search}". Try checking your spelling or clearing filters.`
              : "Upload your first technical specification, paper, or document to start building your PDF library."}
          </p>
          <Button
            onClick={() => {
              if (search) setSearch("");
              else {
                setDroppedFile(null);
                setUploadDialogOpen(true);
              }
            }}
            className="mt-4 h-9 gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs cursor-pointer"
          >
            {search ? (
              <span>Clear Search</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Upload First PDF</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        initialFile={droppedFile}
        onUploadSuccess={() => {
          router.refresh();
        }}
      />

      {/* Embedded PDF Viewer Modal */}
      <PdfViewerModal
        document={previewDoc}
        open={!!previewDoc}
        onOpenChange={(open) => {
          if (!open) setPreviewDoc(null);
        }}
      />
    </div>
  );
}
