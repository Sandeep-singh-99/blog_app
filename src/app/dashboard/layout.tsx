import React, { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import SidebarHeader from "@/components/dashboard/SidebarHeader";

const Layout = async ({ children }: { children: ReactNode }) => {
  // const { userId } = await auth();
  // if (!userId) throw new Error("User not logged in");

  // const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  // if (!user) throw new Error("User not found");

  return (
    // <div className="min-h-screen w-full flex">
    //   <Sidebar userId={user.id} />
    //   <main className="flex-1">{children}</main>
    // </div>
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
