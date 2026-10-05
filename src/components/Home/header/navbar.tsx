"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SearchInput from "./search-input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu,
  X,
  ShieldCheck,
  ArrowRight,
  Layers,
} from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-b border-border/40 bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/30">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90 backdrop-blur-xs transition-colors group-hover:bg-background/80">
              <ShieldCheck className="h-5 w-5 text-indigo-500 transition-transform duration-300 group-hover:scale-110 dark:text-indigo-400" />
            </div>
            {/* Subtle pulsing badge */}
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80">
                Note<span className="bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">Vault</span>
              </span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                v2.0
              </span>
            </div>
            <span className="hidden sm:inline-block text-[10px] font-medium text-muted-foreground tracking-wide -mt-0.5">
              Personal Workspace & Vault
            </span>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search (Desktop) */}
          <div className="hidden md:block">
            <SearchInput />
          </div>

          {/* Theme Mode Toggle with Cool Animation */}
          <ThemeToggle />

          {/* SignedIn State */}
          <SignedIn>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 transition-all duration-200 hover:border-indigo-500/50 hover:bg-indigo-500/20 dark:text-indigo-300"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Workspace</span>
            </Link>

            <div className="flex items-center pl-1">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-9 w-9 ring-2 ring-indigo-500/20 hover:ring-indigo-500/50 transition-all",
                  },
                }}
              />
            </div>
          </SignedIn>

          {/* SignedOut State */}
          <SignedOut>
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-4 py-2 font-medium text-white shadow-md shadow-indigo-500/20 transition-all duration-300 hover:opacity-95 hover:shadow-indigo-500/30 active:scale-95"
                >
                  <span className="flex items-center gap-1.5">
                    <span>Get Started</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="border-t border-border/80 bg-background/95 backdrop-blur-2xl sm:hidden transition-all duration-200 animate-in slide-in-from-top-2">
          <div className="space-y-4 px-4 py-5">
            {/* Search */}
            <div className="w-full">
              <SearchInput />
            </div>

            {/* Auth Section in Mobile Menu */}
            <div className="border-t border-border/60 pt-3">
              <SignedIn>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  <Layers className="h-4 w-4" />
                  <span>Go to Workspace Dashboard</span>
                </Link>
              </SignedIn>

              <SignedOut>
                <div className="flex flex-col gap-2.5">
                  <SignInButton mode="modal">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl justify-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <Button
                      className="w-full rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 text-white justify-center shadow-md shadow-indigo-500/20"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started Free
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}