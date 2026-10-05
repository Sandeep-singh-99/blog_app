"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function SidebarHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Workspace Overview";
    if (pathname.includes("/dashboard/notes/create") || pathname.includes("/dashboard/articles/create"))
      return "Capture New Note";
    if (pathname.includes("/edit")) return "Edit Note";
    if (pathname.startsWith("/dashboard/notes")) return "Knowledge Notes";
    if (pathname.startsWith("/dashboard/documents")) return "PDFs & Documents";
    if (pathname.startsWith("/dashboard/projects")) return "Projects & Sprints";
    if (pathname.startsWith("/dashboard/secrets")) return "Encrypted Secrets Vault";
    if (pathname.startsWith("/dashboard/tasks")) return "Tasks & Action Inbox";
    if (pathname.includes("/dashboard/bookmark")) return "Pinned Knowledge";
    if (pathname.includes("/dashboard/connections")) return "Collaborators";
    return "Personal Workspace";
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 md:px-6 backdrop-blur-md transition-all">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg hover:bg-muted transition-colors cursor-pointer" />
        <Separator orientation="vertical" className="h-4 bg-border/60" />
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground tracking-tight">
            {getPageTitle()}
          </span>
        </div>
      </div>
    </header>
  );
}
