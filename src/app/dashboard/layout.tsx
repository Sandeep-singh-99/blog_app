import React, { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarHeader from "@/components/dashboard/SidebarHeader";

const Layout = async ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <Sidebar />
      <div className="w-full p-5">
        <SidebarHeader />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default Layout;
