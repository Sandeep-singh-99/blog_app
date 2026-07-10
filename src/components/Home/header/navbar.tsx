"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import SearchInput from "./search-input";
import { Menu, X } from "lucide-react";
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
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BitWrite
            </span>
            <span className="ml-2 text-gray-900">App</span>
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Dashboard */}
          <SignedIn>
            <Link
              href="/dashboard"
              className="hidden md:flex items-center rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100"
            >
              Dashboard
            </Link>
          </SignedIn>

          {/* Search */}
          <div className="hidden md:block">
            <SearchInput />
          </div>

          {/* Auth */}
          <SignedIn>
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "h-10 w-10 ring-2 ring-gray-200 hover:ring-blue-300 transition",
                  },
                }}
              />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center gap-2">
              <SignInButton>
                <Button
                  variant="outline"
                  className="border-gray-300 bg-white hover:bg-gray-100"
                >
                  Login
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="border-t border-gray-200 bg-white shadow-lg md:hidden">
          <div className="space-y-4 px-4 py-4">
            {/* Search */}
            <SearchInput />

            {/* Dashboard */}
            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
              >
                Dashboard
              </Link>
            </SignedIn>

            {/* Login / Signup */}
            <SignedOut>
              <div className="flex flex-col gap-3">
                <SignInButton>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 bg-white hover:bg-gray-100"
                  >
                    Login
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </header>
  );
}