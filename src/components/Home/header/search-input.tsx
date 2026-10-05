"use client";

import { searchAction } from "@/actions/search";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React from "react";

const SearchInput = () => {
  const searchparams = useSearchParams();

  return (
    <form action={searchAction}>
      <div className="relative group w-48 lg:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-primary" />
        <Input
          type="search"
          name="search"
          defaultValue={searchparams.get("search") || ""}
          placeholder="Search workspace..."
          className="h-9 pl-9 pr-10 text-xs sm:text-sm bg-muted/40 hover:bg-muted/70 focus:bg-background border-border/60 transition-all rounded-full focus-visible:ring-1 focus-visible:ring-primary/40"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border/70 bg-background/80 px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-xs">
          <span>⌘</span>K
        </kbd>
      </div>
    </form>
  );
};

export default SearchInput;