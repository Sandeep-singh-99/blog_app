import React, { ReactNode } from "react";
import Sidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SidebarHeader from "@/components/dashboard/SidebarHeader";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset className="min-h-screen bg-muted/15 dark:bg-background">
        <SidebarHeader />
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
