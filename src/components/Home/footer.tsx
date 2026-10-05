"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShieldCheck,
  Mail,
  Linkedin,
  Github,
  Twitter,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed to NoteVault product updates!");
    setEmail("");
  };

  return (
    <footer className="border-t border-border/70 bg-card/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="md:col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Note<span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">Vault</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Your unified personal workspace. Manage rich notes, PDFs & documents,
              projects, zero-knowledge encrypted secrets, tasks, and personal knowledge
              in one private hub.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>

            {/* Live Status indicator */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/80 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • AES-256 Active</span>
            </div>
          </div>

          {/* Workspace Links */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Workspace
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  Knowledge Notes
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-foreground transition-colors">
                  PDF & Documents
                </Link>
              </li>
              <li>
                <Link href="#workspace" className="hover:text-foreground transition-colors">
                  Projects & Sprints
                </Link>
              </li>
              <li>
                <Link href="#vault" className="hover:text-foreground transition-colors">
                  Encrypted Secrets
                </Link>
              </li>
              <li>
                <Link href="#workspace" className="hover:text-foreground transition-colors">
                  Task Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Security Links */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Security
            </h3>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              <li>
                <Link href="#security" className="hover:text-foreground transition-colors">
                  Zero-Knowledge Model
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-foreground transition-colors">
                  AES-256 Specifications
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-foreground transition-colors">
                  Argon2id Key Derivation
                </Link>
              </li>
              <li>
                <Link href="#security" className="hover:text-foreground transition-colors">
                  Local-First Cryptography
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-foreground transition-colors">
                  Security FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="md:col-span-2 space-y-3.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Stay in the Loop
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Subscribe to get release notes, product updates, and privacy-first productivity
              tips directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="h-10 text-xs pl-9 rounded-xl border-border/80 bg-background"
                  required
                />
                <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <Button
                type="submit"
                size="sm"
                className="h-10 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white font-semibold text-xs px-4 shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="mt-12 border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NoteVault. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="#security" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#faq" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#security" className="hover:text-foreground transition-colors">
              Security Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}