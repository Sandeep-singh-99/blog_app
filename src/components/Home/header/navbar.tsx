"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import SearchInput from "./search-input";
import { ToggleMode } from "./toggle-mode";
import { Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sticky top-0 z-50 w-full border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={"/"} className="flex items-center space-x-2">
              <span className="font-bold text-2xl">
                <span className="bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-500 dark:to-indigo-500 bg-clip-text text-transparent">
                  BitWrite
                </span>
                <span className="text-foreground ml-2">App</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <SignedIn>
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/articles"
                  className="px-4 py-2 text-sm font-medium rounded-md border border-transparent
               bg-neutral-100 text-neutral-700 hover:bg-neutral-200
               dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800
               transition-all duration-200"
                >
                  Articles
                </Link>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium rounded-md border border-transparent
               bg-neutral-100 text-neutral-700 hover:bg-neutral-200
               dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800
               transition-all duration-200"
                >
                  Dashboard
                </Link>
              </div>
            </SignedIn>

            <div className="hidden md:flex  items-center gap-3">
              <SearchInput />
            </div>
            <ToggleMode />

            {/* user actions */}

            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton>
                  <Button variant="outline">Login</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>SignUp</Button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t">
            {/* Search Bar (Mobile) */}
            <div className="px-4">
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  name="search"
                  placeholder="Search articles..."
                  className="pl-10 w-full focus-visible:ring-1"
                />
              </div> */}
               <SearchInput />
            </div>

            {/* Mobile Navigation Links */}
            <SignedIn>
              <div className="space-y-2 px-4">
                <Link
                  href="/articles"
                  className="block px-3 py-2 text-base font-medium text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Articles
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </div>
            </SignedIn>
          </div>
        )}
      </div>
    </div>
  );
}
