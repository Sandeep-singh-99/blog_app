"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import { 
  BookMarkedIcon, 
  FileText, 
  LayoutDashboard, 
  Sparkles, 
  User, 
  UserCircle2 
} from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  useSidebar 
} from '../ui/sidebar';

const MenuOptions = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    title: "Articles",
    url: "/dashboard/articles/create",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <User className="h-4 w-4" />,
  },
  {
    title: "Connections",
    url: "/dashboard/connections",
    icon: <UserCircle2 className="h-4 w-4" />,
  },
  {
    title: "Bookmarked Articles",
    url: "/dashboard/bookmark",
    icon: <BookMarkedIcon className="h-4 w-4" />,
  },
];

export default function DashboardSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  return (
    <Sidebar collapsible='icon' className="border-r border-slate-100 bg-white">
      <SidebarHeader className="border-b border-slate-50 py-4 px-3 flex flex-col justify-center min-h-[70px]">
        {open ? (
          <Link href={'/'} className='flex items-center gap-2.5 transition-all duration-200 hover:opacity-90'>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/50">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BitWrite
              </span>
              <span className="ml-1.5 text-gray-900">App</span>
            </span>
          </Link>
        ) : (
          <Link href={'/'} className='flex items-center justify-center transition-all duration-200 hover:opacity-90'>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200/50">
              <Sparkles className="h-5 w-5" />
            </div>
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400/80 px-3 mb-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {MenuOptions.map((option, index) => {
                const isActive = pathname === option.url || (option.url !== '/dashboard' && pathname.startsWith(option.url));
                return (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      size={open ? "lg" : "default"}
                      className={`transition-all duration-200 rounded-xl px-3 flex items-center gap-3 w-full ${
                        isActive 
                          ? "bg-blue-50/80 text-blue-700 font-semibold hover:bg-blue-50/80 [&>svg]:text-blue-600 [&>svg]:scale-105" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50/80 [&>svg]:text-slate-400 hover:[&>svg]:text-slate-600"
                      }`}
                    >
                      <Link href={option.url}>
                        {option.icon}
                        <span className="font-medium">{option.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className={`p-4 border-t border-slate-100/80 transition-all duration-200 ${open ? "" : "flex items-center justify-center"}`}>
        {isLoaded && user && (
          open ? (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/60 border border-slate-100/60 shadow-xs hover:bg-slate-100/50 transition-all duration-200">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-white hover:ring-blue-300 transition",
                  },
                }}
              />
              <div className="flex-1 min-w-0 flex flex-col">
                <span className="text-sm font-semibold text-slate-900 truncate">
                  {user.fullName || "User"}
                </span>
                <span className="text-xs text-slate-500 truncate max-w-[140px]">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-1">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-white hover:ring-blue-300 transition",
                  },
                }}
              />
            </div>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  )
}