import WorkspaceDashboard from "@/components/dashboard/workspace-dashboard";
import React from "react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workspace Overview | NoteVault",
  description:
    "Personal Workspace — Manage notes, PDFs/documents, projects, encrypted secrets, tasks, and personal knowledge in one place.",
};

export default function Dashboard() {
  return (
    <div className="w-full">
      <WorkspaceDashboard />
    </div>
  );
}
