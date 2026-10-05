"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  FileUp,
  FileText,
  Search,
  BookOpen,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Eye,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState([
    {
      id: "doc-1",
      name: "Distributed_Systems_Patterns_v2.pdf",
      size: "4.8 MB",
      pages: 142,
      ocrStatus: "Indexed",
      category: "Architecture",
      date: "Oct 04, 2026",
      summary: "Detailed analysis of consensus protocols, Raft leader election, and Paxos state machines.",
    },
    {
      id: "doc-2",
      name: "AES_256_GCM_Specification_RFC5116.pdf",
      size: "1.2 MB",
      pages: 36,
      ocrStatus: "Indexed",
      category: "Security",
      date: "Oct 01, 2026",
      summary: "Cryptographic reference standard for authenticated encryption with associated data.",
    },
    {
      id: "doc-3",
      name: "PostgreSQL_Internal_B-Tree_Indexing.pdf",
      size: "3.4 MB",
      pages: 68,
      ocrStatus: "Indexed",
      category: "Database",
      date: "Sep 28, 2026",
      summary: "Storage layout of Postgres index pages, WAL write-ahead logging, and query planner optimization.",
    },
    {
      id: "doc-4",
      name: "High_Performance_Browser_Networking.pdf",
      size: "8.1 MB",
      pages: 210,
      ocrStatus: "Indexed",
      category: "Networking",
      date: "Sep 20, 2026",
      summary: "TCP fast open, TLS 1.3 0-RTT handshakes, HTTP/2 multiplexing, and WebSockets protocol.",
    },
  ]);

  const [previewDoc, setPreviewDoc] = useState<typeof documents[0] | null>(null);

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadSimulation = () => {
    toast.info("PDF upload simulator: select any PDF to index into NoteVault!");
    const newDoc = {
      id: `doc-${Date.now()}`,
      name: `Uploaded_Research_Paper_${documents.length + 1}.pdf`,
      size: "2.6 MB",
      pages: 48,
      ocrStatus: "Indexed",
      category: "General",
      date: "Just now",
      summary: "Freshly uploaded technical document indexed with full OCR text recognition.",
    };
    setDocuments([newDoc, ...documents]);
    toast.success("Document uploaded & OCR indexed successfully!");
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    toast.success("Document removed from library.");
    if (previewDoc?.id === id) setPreviewDoc(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            PDFs & Document Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Upload, OCR-index, and side-by-side annotate technical documents and whitepapers.
          </p>
        </div>

        <Button
          onClick={handleUploadSimulation}
          className="h-9 gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs shadow-md shadow-cyan-500/20"
        >
          <FileUp className="h-4 w-4" />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Upload Dropzone Banner */}
      <div
        onClick={handleUploadSimulation}
        className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-cyan-500/30 bg-cyan-500/5 p-6 text-center hover:border-cyan-500/60 hover:bg-cyan-500/10 transition-all"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-500 group-hover:scale-110 transition-transform">
            <FileUp className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            Click to upload or drag & drop PDFs, EPUBs, or Technical Papers
          </h3>
          <p className="text-xs text-muted-foreground">
            Up to 50MB per file • Full client-side OCR indexing and vector search
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents by name or topic..."
          className="pl-9 h-10 rounded-xl text-xs bg-card"
        />
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <Card key={doc.id} className="border border-border/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground truncate max-w-[180px]" title={doc.name}>
                      {doc.name}
                    </CardTitle>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {doc.size} • {doc.pages} Pages
                    </span>
                  </div>
                </div>

                <span className="rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  {doc.ocrStatus}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground line-clamp-2">
                {doc.summary}
              </p>

              <div className="flex items-center justify-between border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                <span className="rounded bg-muted px-2 py-0.5 font-semibold text-foreground">
                  #{doc.category}
                </span>
                <span>{doc.date}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewDoc(doc)}
                  className="flex-1 text-xs h-8 rounded-lg gap-1.5"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive"
                  title="Delete Document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Reader / Preview Drawer Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-50">
          <div className="w-full max-w-2xl rounded-2xl border border-border/80 bg-background p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-500" />
                <h3 className="font-bold text-base text-foreground truncate max-w-md">
                  {previewDoc.name}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPreviewDoc(null)}>
                Close
              </Button>
            </div>

            <div className="rounded-xl border border-border/70 bg-muted/40 p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>OCR Index Status: 100% Vector Embedded</span>
                <span>{previewDoc.pages} Pages Total</span>
              </div>
              <div className="p-3 bg-background rounded-lg text-foreground border border-border/50 text-xs font-sans leading-relaxed">
                <strong>Executive Summary:</strong>
                <p className="mt-1 text-muted-foreground">{previewDoc.summary}</p>
              </div>
              <div className="text-[11px] text-emerald-500">
                ✓ Full text searchable via ⌘K Instant Search
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.success("Citation extracted to clipboard!");
                }}
              >
                Extract Citation
              </Button>
              <Button
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={() => {
                  toast.info("Opening dual-pane PDF annotator view...");
                  setPreviewDoc(null);
                }}
              >
                Open in Full Annotator
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
