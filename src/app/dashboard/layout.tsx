import React, { ReactNode } from "react";
import SidebarSwitcher from "@/components/dashboard/SidebarSwitcher";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import SidebarHeader from "@/components/dashboard/SidebarHeader";
import { getAuthenticatedUser } from "@/lib/auth-user";

export default async function Layout({ children }: { children: ReactNode }) {
  await getAuthenticatedUser();

  return (
    <SidebarProvider>
      <React.Suspense fallback={<div className="w-[16rem] border-r border-sidebar-border bg-sidebar" />}>
        <SidebarSwitcher />
      </React.Suspense>
      <SidebarInset className="min-h-screen bg-muted/15 dark:bg-background">
        <SidebarHeader />
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
