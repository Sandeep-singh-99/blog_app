"use client";

import { BookMarkedIcon, FileText, LayoutDashboard, Sparkles, User, UserCircle2 } from 'lucide-react';
import React from 'react'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '../ui/sidebar';
import Link from 'next/link';

const MenuOptions = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Articles",
    url: "/dashboard/articles/create",
    icon: <FileText />,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: <User />,
  },
  {
    title: "Connections",
    url: "/dashboard/connections",
    icon: <UserCircle2 />,
  },
  {
    title: "Bookmarked Articles",
    url: "/dashboard/bookmark",
    icon: <BookMarkedIcon />,
  },
];

export default function DashboardSidebar() {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <Link href={'/'} className='flex items-center gap-2'>
          {open && <span className="text-3xl font-bold">BitWrite App</span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MenuOptions.map((option, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild size={open ? "lg" : "default"}>
                    <Link href={option.url}>
                      {option.icon}
                      <span>{option.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarThemeToggle />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  )
}
