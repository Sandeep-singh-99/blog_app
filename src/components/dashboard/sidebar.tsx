"use client";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import {
  FileText,
  LayoutDashboard,
  User,
} from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  userId: string;
};

const Sidebar = ({ userId }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="md:hidden m-4">
            <LayoutDashboard className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[250px]">
          <DashboardSidebar userId={userId} closeSheet={() => setIsOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="hidden md:block h-screen w-[250px] border-r bg-background">
        <DashboardSidebar userId={userId} />
      </div>
    </div>
  );
};

export default Sidebar;

function DashboardSidebar({ userId, closeSheet }: { userId: string; closeSheet?: () => void }) {
  return (
    <div className="h-full px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Link href={"/"}>
        <span className="text-xl font-bold">BitWrite App</span>
        </Link>
      </div>
      <nav className="space-y-1">
        <Link href={"/dashboard"}>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={closeSheet}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </Button>
        </Link>

        <Link href={"/dashboard/articles/create"}>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={closeSheet}
          >
            <FileText className="mr-2 h-4 w-4" />
            Articles
          </Button>
        </Link>

         <Link href={`/profile/${userId}`} onClick={closeSheet}>
        <Button variant="ghost" className="w-full justify-start">
          <User className="mr-2 h-4 w-4" /> Profile
        </Button>
      </Link>
      </nav>
    </div>
  );
}