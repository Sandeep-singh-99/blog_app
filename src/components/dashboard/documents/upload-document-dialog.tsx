"use client";

import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  FileUp,
  FileText,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
  initialFile?: File | null;
}

const CATEGORIES = [
  "General",
  "Architecture",
  "Research",
  "Security",
  "Database",
  "Networking",
  "Documentation",
];

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onUploadSuccess,
  initialFile = null,
}: UploadDocumentDialogProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState<File | null>(initialFile);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmittingRef = useRef(false);

  React.useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      if (!title) {
        const cleanName = initialFile.name
          .replace(/\.pdf$/i, "")
          .replace(/[-_]/g, " ")
          .trim();
        setTitle(cleanName);
      }
    }
  }, [initialFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const validateAndSetFile = (f: File) => {
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) {
      setErrorMessage("Only PDF files are supported.");
      toast.error("Please select a valid PDF file.");
      return;
    }
    const MAX_SIZE = 25 * 1024 * 1024;
    if (f.size > MAX_SIZE) {
      setErrorMessage("File exceeds the 25MB limit.");
      toast.error("PDF size cannot exceed 25MB.");
      return;
    }
    setErrorMessage(null);
    setFile(f);
    if (!title) {
      const cleanName = f.name
        .replace(/\.pdf$/i, "")
        .replace(/[-_]/g, " ")
        .trim();
      setTitle(cleanName);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("General");
    setSummary("");
    setFile(null);
    setErrorMessage(null);
    isSubmittingRef.current = false;
    setIsUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || isUploading) return;

    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter a title for this document.");
      return;
    }

    if (!file) {
      setErrorMessage("Please select a PDF file to upload.");
      return;
    }

    isSubmittingRef.current = true;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("category", category);
    if (summary.trim()) {
      formData.append("summary", summary.trim());
    }
    formData.append("file", file);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        const err = data.error || "Failed to upload document.";
        setErrorMessage(err);
        toast.error(err);
      } else {
        toast.success("PDF document uploaded successfully!");
        resetForm();
        onOpenChange(false);
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Network error during upload.";
      setErrorMessage(message);
      toast.error(message);
    } finally {
      isSubmittingRef.current = false;
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!isUploading) {
          if (!val) resetForm();
          onOpenChange(val);
        }
      }}
    >
      <DialogContent className="sm:max-w-md md:max-w-lg border-border/80 bg-background/95 backdrop-blur-xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
              <FileUp className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                Upload PDF Document
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Add technical specifications, whitepapers, or PDFs to your vault.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Document Title <span className="text-destructive">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Consensus & Raft Protocol"
              disabled={isUploading}
              className="h-10 rounded-xl text-xs bg-muted/30 focus-visible:ring-cyan-500/30"
              maxLength={120}
            />
          </div>

          {/* PDF File Dropzone / Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              PDF File <span className="text-destructive">*</span>
            </label>

            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-cyan-500 bg-cyan-500/10 scale-[1.01]"
                    : "border-border/80 bg-muted/20 hover:border-cyan-500/50 hover:bg-muted/40"
                } ${isUploading ? "pointer-events-none opacity-50" : ""}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400">
                  <FileUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Click to browse or drop your PDF here
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Maximum file size: 25MB • Format: .pdf
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3.5">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-red-500 font-black text-xs">
                    PDF
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate max-w-[240px] sm:max-w-[300px]">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {!isUploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                    title="Remove file"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">
                Category
              </label>
              <span className="text-[10px] text-muted-foreground">
                Choose a tag
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  disabled={isUploading}
                  onClick={() => setCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                    category === cat
                      ? "bg-cyan-600 text-white shadow-xs font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Summary */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Brief Description / Abstract{" "}
              <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Add key notes, topics, or summary of this PDF..."
              rows={2}
              disabled={isUploading}
              className="w-full rounded-xl border border-input bg-muted/30 p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/30"
              maxLength={300}
            />
          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploading}
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isUploading || !title.trim() || !file}
              className="rounded-xl text-xs h-9 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold gap-1.5 shadow-sm shadow-cyan-600/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading PDF...</span>
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4" />
                  <span>Save Document</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
