"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckSquare,
  Circle,
  CheckCircle2,
  Plus,
  Trash2,
  Calendar,
  Tag,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

type TaskItem = {
  id: string;
  title: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  completed: boolean;
  dueDate: string;
  linkedNote?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: "tsk-1",
      title: "Rotate and encrypt AWS production secret keys in NoteVault",
      priority: "Urgent",
      completed: true,
      dueDate: "Today",
      linkedNote: "AWS_Cloud_Setup.md",
    },
    {
      id: "tsk-2",
      title: "Upload & OCR index distributed consensus research paper PDF",
      priority: "High",
      completed: true,
      dueDate: "Oct 05, 2026",
      linkedNote: "Consensus_Protocols.md",
    },
    {
      id: "tsk-3",
      title: "Draft sprint deliverable milestones for NoteVault Q4 release",
      priority: "High",
      completed: false,
      dueDate: "Tomorrow",
      linkedNote: "Q4_Roadmap.md",
    },
    {
      id: "tsk-4",
      title: "Write documentation on Argon2id master key derivation",
      priority: "Medium",
      completed: false,
      dueDate: "Oct 08, 2026",
      linkedNote: "Crypto_Engine_Spec.md",
    },
    {
      id: "tsk-5",
      title: "Backup encrypted database seed to offline physical hardware",
      priority: "Urgent",
      completed: false,
      dueDate: "Oct 10, 2026",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<TaskItem["priority"]>("High");

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: TaskItem = {
      id: `tsk-${Date.now()}`,
      title: newTitle.trim(),
      priority: newPriority,
      completed: false,
      dueDate: "Upcoming",
    };

    setTasks([newTask, ...tasks]);
    setNewTitle("");
    toast.success("Task added to Action Inbox!");
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.success("Task removed.");
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Tasks & Action Inbox
            </h1>
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400">
              {completedCount} / {tasks.length} Completed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Aggregated checklist actions from all your markdown notes, projects, and daily reviews.
          </p>
        </div>
      </div>

      {/* Quick Add Task Bar */}
      <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
        <Input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Type a new task to capture into your inbox..."
          className="h-10 text-xs rounded-xl flex-1 bg-card"
          required
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as TaskItem["priority"])}
          className="h-10 rounded-xl border border-input bg-card px-3 text-xs text-foreground focus:outline-none"
        >
          <option value="Urgent">Urgent</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <Button
          type="submit"
          className="h-10 px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs"
        >
          <Plus className="h-4 w-4 mr-1" />
          <span>Add Task</span>
        </Button>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border/40 pb-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === "all"
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All ({tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === "active"
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Active ({tasks.length - completedCount})
        </button>
        <button
          type="button"
          onClick={() => setFilter("completed")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            filter === "completed"
              ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2.5">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
              task.completed
                ? "border-emerald-500/30 bg-emerald-500/5 text-muted-foreground"
                : "border-border/80 bg-card hover:border-amber-500/40 text-foreground"
            }`}
          >
            <div
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-3 cursor-pointer flex-1"
            >
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0 hover:text-amber-500" />
              )}
              <div className="space-y-0.5">
                <span
                  className={`text-xs sm:text-sm font-semibold ${
                    task.completed ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>

                {task.linkedNote && (
                  <div className="text-[10px] text-indigo-500 font-medium">
                    From Note: {task.linkedNote}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${
                  task.priority === "Urgent"
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30"
                    : task.priority === "High"
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {task.priority}
              </span>

              <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
                {task.dueDate}
              </span>

              <button
                type="button"
                onClick={() => handleDelete(task.id)}
                className="h-7 w-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="py-12 text-center text-xs text-muted-foreground border-2 border-dashed border-border/60 rounded-2xl">
            No tasks found in this view.
          </div>
        )}
      </div>
    </div>
  );
}
