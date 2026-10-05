"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  MoreVertical,
  Layers,
  Tag,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

type ProjectTask = {
  id: string;
  title: string;
  tag: string;
  priority: "High" | "Medium" | "Urgent" | "Normal";
  column: "backlog" | "in_progress" | "review" | "done";
  linkedNote?: string;
};

export default function ProjectsPage() {
  const [tasks, setTasks] = useState<ProjectTask[]>([
    {
      id: "pt-1",
      title: "Design Zero-Knowledge AES Vault cryptographic primitives",
      tag: "Crypto",
      priority: "Urgent",
      column: "done",
      linkedNote: "Crypto_Engine_Spec.md",
    },
    {
      id: "pt-2",
      title: "Implement PDF OCR indexing and full-text vector extraction",
      tag: "PDFs",
      priority: "High",
      column: "in_progress",
      linkedNote: "OCR_Pipeline.md",
    },
    {
      id: "pt-3",
      title: "Create interactive dark/light theme switch animation",
      tag: "UI/UX",
      priority: "Normal",
      column: "done",
      linkedNote: "Theme_System.md",
    },
    {
      id: "pt-4",
      title: "Build client-side master password Argon2 key generator",
      tag: "Security",
      priority: "Urgent",
      column: "in_progress",
      linkedNote: "Security_Audit.md",
    },
    {
      id: "pt-5",
      title: "Set up offline local cache sync with IndexedDB",
      tag: "Performance",
      priority: "Medium",
      column: "backlog",
      linkedNote: "Offline_Architecture.md",
    },
    {
      id: "pt-6",
      title: "End-to-end security penetration testing on secrets store",
      tag: "Security",
      priority: "High",
      column: "review",
      linkedNote: "PenTest_Report.md",
    },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const moveTask = (id: string, targetCol: ProjectTask["column"]) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, column: targetCol } : t))
    );
    toast.success("Task status updated!");
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: ProjectTask = {
      id: `pt-${Date.now()}`,
      title: newTaskTitle.trim(),
      tag: "Workspace",
      priority: "High",
      column: "backlog",
      linkedNote: "General_Notes.md",
    };
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    toast.success("New sprint task created!");
  };

  const completedCount = tasks.filter((t) => t.column === "done").length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const columns: { id: ProjectTask["column"]; title: string; color: string }[] = [
    { id: "backlog", title: "Backlog", color: "border-border" },
    { id: "in_progress", title: "In Progress", color: "border-indigo-500/40" },
    { id: "review", title: "Code Review", color: "border-amber-500/40" },
    { id: "done", title: "Shipped", color: "border-emerald-500/40" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Projects & Sprint Kanban
            </h1>
            <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-bold text-violet-600 dark:text-violet-400">
              Sprint #4
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Organize engineering deliverables, milestones, and link tasks directly to your notes.
          </p>
        </div>

        {/* Sprint Progress Pill */}
        <div className="flex items-center gap-3 bg-card border border-border/70 px-4 py-2 rounded-2xl shadow-xs">
          <div className="text-right">
            <div className="text-xs font-bold text-foreground">Sprint Velocity</div>
            <div className="text-[10px] text-muted-foreground">
              {completedCount} of {tasks.length} Shipped ({progressPercent}%)
            </div>
          </div>
          <div className="w-16 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Add Task Form */}
      <form onSubmit={handleAddTask} className="flex gap-2 max-w-lg">
        <Input
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add new task to backlog..."
          className="h-10 text-xs rounded-xl bg-card"
        />
        <Button type="submit" size="sm" className="h-10 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs">
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Task</span>
        </Button>
      </form>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.column === col.id);

          return (
            <div
              key={col.id}
              className={`rounded-2xl border ${col.color} bg-muted/20 p-4 space-y-3 flex flex-col justify-between min-h-[460px]`}
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-border/50">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    {col.title}
                  </h3>
                  <span className="rounded-full bg-background border px-2 py-0.5 text-[10px] font-mono font-bold text-muted-foreground">
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5">
                  {colTasks.map((task) => (
                    <Card
                      key={task.id}
                      className="border border-border/80 shadow-xs hover:shadow-md transition-all p-3.5 space-y-2.5 bg-card"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-xs font-semibold text-foreground leading-snug">
                          {task.title}
                        </span>
                      </div>

                      {task.linkedNote && (
                        <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-medium">
                          <FileText className="h-3 w-3" />
                          <span>{task.linkedNote}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px]">
                        <span className="rounded bg-muted px-1.5 py-0.5 text-muted-foreground font-semibold">
                          #{task.tag}
                        </span>

                        {/* Move Actions dropdown buttons */}
                        <div className="flex items-center gap-1">
                          {col.id !== "done" && (
                            <button
                              type="button"
                              onClick={() => {
                                const nextCol: Record<string, ProjectTask["column"]> = {
                                  backlog: "in_progress",
                                  in_progress: "review",
                                  review: "done",
                                };
                                moveTask(task.id, nextCol[col.id]);
                              }}
                              className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                            >
                              Next →
                            </button>
                          )}
                          {col.id === "done" && (
                            <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Done</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}

                  {colTasks.length === 0 && (
                    <div className="py-8 text-center text-xs text-muted-foreground border-2 border-dashed border-border/60 rounded-xl">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
