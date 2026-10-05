"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FileText,
  FileUp,
  FolderKanban,
  Lock,
  CheckSquare,
  Bookmark,
  Tag,
  User,
  Settings,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
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

// Core Workspace Navigation Groups for NoteVault
const workspaceNavItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Knowledge Notes",
    url: "/dashboard/notes",
    icon: FileText,
    badge: null,
  },
  {
    title: "PDFs & Documents",
    url: "/dashboard/documents",
    icon: FileUp,
    badge: null,
  },
  {
    title: "Projects & Sprints",
    url: "/dashboard/projects",
    icon: FolderKanban,
    badge: null,
  },
  {
    title: "Encrypted Vault",
    url: "/dashboard/secrets",
    icon: Lock,
    badge: "AES",
  },
  {
    title: "Tasks & Actions",
    url: "/dashboard/tasks",
    icon: CheckSquare,
    badge: null,
  },
];

const libraryNavItems = [
  {
    title: "Pinned & Saved",
    url: "/dashboard/bookmark",
    icon: Bookmark,
  },
  {
    title: "Knowledge Tags",
    url: "/tags",
    icon: Tag,
  },
  {
    title: "Workspace Profile",
    url: "/profile",
    icon: User,
  },
];

export default function DashboardSidebar() {
  const { open, isMobile } = useSidebar();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const { openUserProfile, signOut } = useClerk();

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

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300"
    >
      {/* SIDEBAR HEADER / BRANDING */}
      <SidebarHeader className="border-b border-sidebar-border/60 p-3 min-h-[64px] flex flex-col justify-center">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-90 group w-full"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>

            {open && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-neutral-900 dark:text-white">
                    Note<span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">Vault</span>
                  </span>
                  <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                    v2.0
                  </span>
                </div>
                <span className="text-xs text-muted-foreground truncate font-medium">
                  Personal Workspace
                </span>
              </div>
            )}
          </Link>
        </div>
      </SidebarHeader>

      {/* SIDEBAR CONTENT */}
      <SidebarContent className="px-2 py-3 gap-4">
        {/* Main Workspace Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-3">
            Personal Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {workspaceNavItems.map((item) => {
                const isActive =
                  pathname === item.url ||
                  (item.url !== "/dashboard" && pathname.startsWith(item.url));
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9.5 px-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-indigo-600 text-white font-semibold shadow-xs hover:bg-indigo-700 hover:text-white"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : ""}`} />
                          <span className="text-sm font-medium">{item.title}</span>
                        </div>
                        {item.badge && open && (
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Add Action (when sidebar open) */}
        {open && (
          <div className="px-3 pt-1">
            <Link href="/dashboard/notes/create">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/5 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Quick Capture Note</span>
              </button>
            </Link>
          </div>
        )}

        {/* Library & Organization */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase px-3">
            Knowledge Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {libraryNavItems.map((item) => {
                const isActive = pathname === item.url;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`h-9 px-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* SIDEBAR FOOTER (USER PROFILE & SETTINGS) */}
      <SidebarFooter className="border-t border-sidebar-border/60 p-2">
        {isLoaded && user && (
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <div className="flex items-center justify-between w-full p-1.5 rounded-xl transition-colors hover:bg-sidebar-accent/60">
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 min-w-0 flex-1 text-left focus-visible:outline-none cursor-pointer">
                      <Avatar className="h-9 w-9 rounded-xl ring-1 ring-border shrink-0">
                        <AvatarImage src={user.imageUrl} alt={userName} />
                        <AvatarFallback className="rounded-xl bg-indigo-600/10 text-indigo-600 font-bold text-xs">
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

                {/* Dropdown Menu Options */}
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