"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`relative h-9 w-9 rounded-full border border-border/40 bg-background/50 backdrop-blur-md opacity-70 ${className}`}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4 rounded-full bg-muted animate-pulse" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`group relative h-9 w-9 overflow-hidden rounded-full border border-border/60 bg-background/70 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-accent/60 hover:shadow-md hover:ring-2 hover:ring-primary/20 active:scale-95 ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme mode"
    >
      {/* Background ambient glow on hover */}
      <span
        className={`absolute inset-0 -z-10 rounded-full opacity-0 blur-xs transition-opacity duration-300 group-hover:opacity-100 ${
          isDark
            ? "bg-indigo-500/20"
            : "bg-amber-400/20"
        }`}
      />

      {/* Sun Icon */}
      <Sun
        className={`h-[1.15rem] w-[1.15rem] text-amber-500 transition-all duration-500 ease-out transform ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100 text-amber-500"
        }`}
      />

      {/* Moon Icon */}
      <Moon
        className={`absolute h-[1.15rem] w-[1.15rem] text-indigo-400 transition-all duration-500 ease-out transform ${
          isDark
            ? "rotate-0 scale-100 opacity-100 text-indigo-400"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />

      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
