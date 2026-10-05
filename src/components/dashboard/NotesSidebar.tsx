"use client";

import React, { useState, useEffect, useCallback, useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  ArrowLeft,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  CornerDownRight,
  Search,
  BookOpen,
  Settings,
  LogOut,
  ExternalLink,
  User,
  X,
  MoreHorizontal,
  ArrowUpRight,
  Trash2,
  FilePlus2,
  Layers,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { promoteSubNote } from "@/actions/move-subnote";
import { deleteArticle } from "@/actions/delete-article";

type SubNoteItem = {
  id: string;
  title: string;
  parentId: string | null;
  updatedAt: string;
};

type NoteTreeItem = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  subNotes: SubNoteItem[];
};

// Microsoft OneNote-style vibrant section color palette
const ONENOTE_ACCENTS = [
  { border: "border-purple-500", text: "text-purple-600 dark:text-purple-400", dot: "bg-purple-500", line: "border-purple-400/50" },
  { border: "border-blue-500", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500", line: "border-blue-400/50" },
  { border: "border-teal-500", text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-500", line: "border-teal-400/50" },
  { border: "border-amber-500", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500", line: "border-amber-400/50" },
  { border: "border-rose-500", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-500", line: "border-rose-400/50" },
  { border: "border-indigo-500", text: "text-indigo-600 dark:text-indigo-400", dot: "bg-indigo-500", line: "border-indigo-400/50" },
];

export default function NotesSidebar() {
  const { open, isMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentParentId = searchParams.get("parentId");
  const isCreatingNote = pathname === "/dashboard/notes/create";

  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();

  const [notesTree, setNotesTree] = useState<NoteTreeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [isPendingAction, startTransition] = useTransition();

  const userInitials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    user?.firstName?.[0]?.toUpperCase() ||
    "V";

  const userEmail =
    user?.primaryEmailAddress?.emailAddress || "user@notevault.app";
  const userName = user?.fullName || user?.firstName || "Vault Master";

  const fetchNotesTree = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notes/tree");
      if (res.ok) {
        const data = await res.json();
        const loadedNotes: NoteTreeItem[] = data.notes || [];
        setNotesTree(loadedNotes);
        // Expand notes that have subnotes by default so subnotes are always visible
        setExpandedNotes((prev) => {
          const next = { ...prev };
          for (const n of loadedNotes) {
            if (n.subNotes && n.subNotes.length > 0 && next[n.id] === undefined) {
              next[n.id] = true;
            }
          }
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to load notes tree", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotesTree();

    const handleNotesUpdated = () => {
      fetchNotesTree();
    };

    window.addEventListener("notes-updated", handleNotesUpdated);
    return () => {
      window.removeEventListener("notes-updated", handleNotesUpdated);
    };
  }, [fetchNotesTree]);

  // Determine currently active note id from URL
  const activeNoteId = useMemo(() => {
    if (pathname.startsWith("/dashboard/notes/") && pathname !== "/dashboard/notes/create") {
      return pathname.replace("/dashboard/notes/", "").split("/")[0];
    }
    return null;
  }, [pathname]);

  // Auto-expand parent note if creating a subnote for it or viewing its child
  useEffect(() => {
    if (currentParentId) {
      setExpandedNotes((prev) => ({ ...prev, [currentParentId]: true }));
    }
    if (activeNoteId) {
      for (const parent of notesTree) {
        if (parent.subNotes?.some((sub) => sub.id === activeNoteId)) {
          setExpandedNotes((prev) => ({ ...prev, [parent.id]: true }));
          break;
        }
      }
    }
  }, [currentParentId, activeNoteId, notesTree]);

  const toggleExpand = (noteId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNotes((prev) => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  // OneNote action: Add Subpage under a specific note
  const handleCreateSubNote = (parentNoteId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedNotes((prev) => ({ ...prev, [parentNoteId]: true }));
    router.push(`/dashboard/notes/create?parentId=${parentNoteId}`);
  };


  // OneNote action: Promote subpage to main page
  const handlePromoteSubNote = async (subNoteId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    startTransition(async () => {
      const res = await promoteSubNote(subNoteId);
      if (res.success) {
        toast.success("Page promoted to main level");
        fetchNotesTree();
        window.dispatchEvent(new Event("notes-updated"));
      } else {
        toast.error(res.error || "Failed to promote page");
      }
    });
  };

  // Delete note from sidebar
  const handleDeleteNote = async (noteId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!confirm("Are you sure you want to delete this page? Any nested subpages will also be deleted.")) {
      return;
    }
    startTransition(async () => {
      await deleteArticle(noteId);
      toast.success("Page deleted");
      fetchNotesTree();
      window.dispatchEvent(new Event("notes-updated"));
      if (activeNoteId === noteId) {
        router.push("/dashboard/notes");
      }
    });
  };

  // Filter notes tree based on search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notesTree;
    const q = searchQuery.toLowerCase();
    return notesTree.filter((note) => {
      const mainMatch = note.title.toLowerCase().includes(q);
      const subMatch = note.subNotes?.some((s) => s.title.toLowerCase().includes(q));
      return mainMatch || subMatch;
    });
  }, [notesTree, searchQuery]);

  const activeParentNote = notesTree.find((n) => n.id === currentParentId);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300"
    >
      {/* SIDEBAR HEADER: BACK TO WORKSPACE & ONENOTE PAGES BAR */}
      <SidebarHeader className="border-b border-sidebar-border/60 p-3 flex flex-col gap-2.5">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
          {open && <span>Back to Main Workspace</span>}
        </Link>

        {open && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 text-white shadow-xs">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground tracking-tight">
                    OneNote Pages
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">
                    Pages & Subpages Tree
                  </span>
                </div>
              </div>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => router.push("/dashboard/notes/create")}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
                      aria-label="New page"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <span>New Page</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </SidebarHeader>

      {/* SIDEBAR CONTENT: SEARCH & ONENOTE PAGES LIST */}
      <SidebarContent className="px-2 py-3 gap-3">
        {/* Quick Search */}
        {open && (
          <div className="relative px-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pages..."
              className="w-full h-8 pl-8 pr-7 text-xs rounded-lg bg-muted/40 hover:bg-muted/60 focus:bg-background border border-border/60 transition-all outline-none focus:ring-1 focus:ring-purple-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* OneNote Pages List */}
        <SidebarGroup className="pt-0">
          {open && (
            <div className="flex items-center justify-between px-2 py-1 mb-1">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Pages & Subpages
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground font-semibold">
                {notesTree.length} pages
              </span>
            </div>
          )}

          {/* Root Page Drafting Tab */}
          {open && isCreatingNote && !currentParentId && (
            <div className="mx-1 mb-2 px-3 py-2 rounded-lg border-l-4 border-l-purple-600 border border-purple-500/30 bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-2 min-w-0">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                </span>
                <span className="truncate">New Page (Drafting...)</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-600 text-white font-bold">
                Main
              </span>
            </div>
          )}

          {/* Pages Tree */}
          <div className="space-y-1 px-1 overflow-y-auto max-h-[calc(100vh-320px)] overscroll-contain pr-1 custom-scrollbar">
            {isLoading && notesTree.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground animate-pulse">
                Loading notebook pages...
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="py-6 px-3 text-center rounded-xl border border-dashed border-border/70 bg-muted/20 text-xs text-muted-foreground space-y-2">
                <p className="font-medium">
                  {searchQuery ? "No matching pages found" : "Notebook is empty"}
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/notes/create")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create first page</span>
                </button>
              </div>
            ) : (
              filteredNotes.map((note, index) => {
                const accent = ONENOTE_ACCENTS[index % ONENOTE_ACCENTS.length];
                const isMainActive = pathname === `/dashboard/notes/${note.id}`;
                const isCurrentParentCreating = isCreatingNote && currentParentId === note.id;
                const hasSubNotes = note.subNotes && note.subNotes.length > 0;
                const isExpanded = !!expandedNotes[note.id] || isCurrentParentCreating;

                return (
                  <div key={note.id} className="group/item flex flex-col">
                    {/* OneNote Main Page Tab */}
                    <div
                      className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-all relative ${
                        isMainActive
                          ? `bg-purple-600 text-white font-bold shadow-xs border-l-4 ${accent.border}`
                          : isCurrentParentCreating
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold border-l-4 border-purple-500 ring-1 ring-purple-500/30"
                          : "text-foreground/90 hover:bg-sidebar-accent hover:text-foreground border-l-2 border-transparent hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        {/* Expand / Collapse Disclosure Button */}
                        {hasSubNotes ? (
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(note.id, e)}
                            className={`p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer ${
                              isMainActive ? "text-white" : "text-muted-foreground"
                            }`}
                            title={isExpanded ? "Collapse subpages" : "Expand subpages"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3.5 w-3.5" />
                            ) : (
                              <ChevronRight className="h-3.5 w-3.5" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4 h-3 flex items-center justify-center shrink-0">
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isMainActive ? "bg-white" : accent.dot
                              }`}
                            />
                          </span>
                        )}

                        {/* Page Link */}
                        <Link
                          href={`/dashboard/notes/${note.id}`}
                          className="flex items-center gap-1.5 min-w-0 flex-1 truncate"
                          title={note.title}
                        >
                          <FileText
                            className={`h-3.5 w-3.5 shrink-0 ${
                              isMainActive
                                ? "text-white"
                                : isCurrentParentCreating
                                ? "text-purple-600 dark:text-purple-400"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="truncate">{note.title}</span>
                        </Link>
                      </div>

                      {/* Right Action Icons: Subpages count + Quick Actions */}
                      <div className="flex items-center gap-1 shrink-0 ml-1">
                        {hasSubNotes && !isMainActive && (
                          <span className="text-[10px] font-mono px-1 rounded bg-muted/80 text-muted-foreground group-hover/item:hidden font-medium">
                            {note.subNotes.length}
                          </span>
                        )}

                        {/* Hover Quick Add Subpage button */}
                        <TooltipProvider delayDuration={150}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                type="button"
                                onClick={(e) => handleCreateSubNote(note.id, e)}
                                className={`p-1 rounded-md transition-all cursor-pointer ${
                                  isCurrentParentCreating
                                    ? "bg-purple-600 text-white opacity-100"
                                    : isMainActive
                                    ? "text-white hover:bg-white/20"
                                    : "text-muted-foreground hover:bg-purple-500/20 hover:text-purple-600 dark:hover:text-purple-400 opacity-0 group-hover/item:opacity-100"
                                }`}
                                aria-label="Add subpage"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <span>Make Subpage under &quot;{note.title}&quot;</span>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* More Options Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={`p-1 rounded-md transition-all cursor-pointer ${
                                isMainActive
                                  ? "text-white hover:bg-white/20"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground opacity-0 group-hover/item:opacity-100"
                              }`}
                              title="Page options"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 text-xs">
                            <DropdownMenuItem
                              onClick={() => handleCreateSubNote(note.id)}
                              className="cursor-pointer gap-2"
                            >
                              <Plus className="h-3.5 w-3.5 text-purple-600" />
                              <span>+ Add Subpage</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                              className="cursor-pointer gap-2"
                            >
                              <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>Open Page</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteNote(note.id)}
                              className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              <span>Delete Page</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* OneNote Subpage Drafting Tab under this main page */}
                    {isCurrentParentCreating && (
                      <div className="ml-5 pl-2.5 py-1.5 border-l-2 border-purple-500/70 flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/10 rounded-r-lg my-0.5 animate-in fade-in slide-in-from-left-1 duration-200">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                          </span>
                          <span className="truncate">↳ New Subpage (Drafting...)</span>
                        </div>
                        <span className="text-[9px] font-mono px-1 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 mr-1.5">
                          Subpage
                        </span>
                      </div>
                    )}

                    {/* Subpages Section (OneNote-style Indentation) */}
                    {isExpanded && hasSubNotes && (
                      <div className={`ml-4 pl-2.5 border-l-2 ${accent.line} space-y-0.5 my-0.5 animate-in fade-in duration-150`}>
                        {note.subNotes.map((subNote) => {
                          const isSubActive = pathname === `/dashboard/notes/${subNote.id}`;
                          return (
                            <div
                              key={subNote.id}
                              className={`group/sub flex items-center justify-between px-2 py-1 rounded-md text-[11px] transition-all ${
                                isSubActive
                                  ? "bg-purple-600 text-white font-semibold shadow-xs"
                                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                              }`}
                            >
                              <Link
                                href={`/dashboard/notes/${subNote.id}`}
                                className="flex items-center gap-1.5 min-w-0 flex-1 truncate"
                                title={subNote.title}
                              >
                                <CornerDownRight
                                  className={`h-3 w-3 shrink-0 ${
                                    isSubActive ? "text-white" : "text-muted-foreground/60"
                                  }`}
                                />
                                <span className="truncate">{subNote.title}</span>
                              </Link>

                              {/* OneNote Subpage Actions: Promote Subpage & Delete */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    type="button"
                                    className={`p-0.5 rounded transition-all cursor-pointer ${
                                      isSubActive
                                        ? "text-white hover:bg-white/20"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground opacity-0 group-hover/sub:opacity-100"
                                    }`}
                                    title="Subpage options"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44 text-xs">
                                  <DropdownMenuItem
                                    onClick={() => handlePromoteSubNote(subNote.id)}
                                    className="cursor-pointer gap-2"
                                  >
                                    <ArrowUpRight className="h-3.5 w-3.5 text-purple-600" />
                                    <span>Promote to Main Page</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/dashboard/notes/${subNote.id}`)}
                                    className="cursor-pointer gap-2"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span>Open Subpage</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteNote(subNote.id)}
                                    className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete Subpage</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* SIDEBAR FOOTER: ONENOTE STATUS & USER ACCOUNT */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        {/* OneNote Active Parent Card when creating subnotes */}
        {open && isCreatingNote && activeParentNote && (
          <div className="mb-2 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs space-y-1.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-purple-700 dark:text-purple-300 font-bold">
              <div className="flex items-center gap-1.5">
                <CornerDownRight className="h-3.5 w-3.5 text-purple-600" />
                <span>OneNote Subpage</span>
              </div>
              <span className="text-[10px] font-mono px-1 rounded bg-purple-500/20">
                Level 1
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              Nested under: <span className="font-semibold text-foreground">{activeParentNote.title}</span>
            </p>
            <Link
              href="/dashboard/notes/create"
              className="text-[10px] text-purple-600 dark:text-purple-400 hover:underline block font-semibold"
            >
              Promote to Main Page instead →
            </Link>
          </div>
        )}

        {isLoaded && user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <div className="flex items-center justify-between w-full p-1.5 rounded-xl transition-colors hover:bg-sidebar-accent/60">
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 min-w-0 flex-1 text-left focus-visible:outline-none cursor-pointer">
                      <Avatar className="h-9 w-9 rounded-xl ring-1 ring-border shrink-0">
                        <AvatarImage src={user.imageUrl} alt={userName} />
                        <AvatarFallback className="rounded-xl bg-purple-600/10 text-purple-600 font-bold text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>

                      {open && (
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-foreground truncate">
                            {userName}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate font-mono">
                            {userEmail}
                          </span>
                        </div>
                      )}
                    </button>
                  </DropdownMenuTrigger>

                  <TooltipProvider delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => openUserProfile()}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors cursor-pointer"
                          aria-label="Open settings"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <span>Vault Settings</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <DropdownMenuContent
                  className="w-64 rounded-xl p-1 shadow-lg border border-border"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-9 w-9 rounded-lg ring-1 ring-border">
                        <AvatarImage src={user.imageUrl} alt={userName} />
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-medium text-xs">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-foreground truncate">
                          {userName}
                        </span>
                        <span className="text-xs text-muted-foreground truncate font-mono">
                          {userEmail}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() => openUserProfile()}
                      className="cursor-pointer gap-2.5 py-2 rounded-lg"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span>Account & Vault Settings</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer gap-2.5 py-2 rounded-lg">
                      <Link href="/profile">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Public Profile</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer gap-2.5 py-2 rounded-lg">
                      <Link href="/">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <span>View Landing Page</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => signOut({ redirectUrl: "/" })}
                    className="cursor-pointer gap-2.5 py-2 rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Lock & Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
