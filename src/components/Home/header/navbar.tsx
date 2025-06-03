import Link from "next/link";
import React from "react";
import { Button } from "../../ui/button";
import SearchInput from "./search-input";
import { ToggleMode } from "./toggle-mode";


export default function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full border border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href={"/"} className="flex items-center space-x-2">
              <span className="font-bold text-2xl">
                <span className="bg-gradient-to-r from-teal-600 to-indigo-600 dark:from-teal-500 dark:to-indigo-500 bg-clip-text text-transparent">
                  Blog
                </span>
                <span className="text-foreground">App</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/articles"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Articles
              </Link>
              <Link
                href="/tutorials"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Tutorials
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>

            {/* Right Section */}

            <div className="flex items-center gap-4">
              <SearchInput/>
              <ToggleMode/>

              <div className="hidden md:flex items-center gap-2">
                <Button>
                    Login
                </Button>
                <Button>
                    SignUp
                </Button>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
}
