"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import NotesSidebar from "./NotesSidebar";

export default function SidebarSwitcher() {
  const pathname = usePathname();

  // If user navigates to create new note or any notes workflow, switch to the dedicated NotesSidebar
  const isNotesWorkflow = pathname.startsWith("/dashboard/notes");

  if (isNotesWorkflow) {
    return <NotesSidebar />;
  }

  return <DashboardSidebar />;
}
