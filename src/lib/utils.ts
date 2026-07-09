import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function countWords(html: string): number {
  if (!html) return 0;
  // Strip HTML tags and replace them with spaces
  const text = html.replace(/<[^>]*>/g, " ");
  // Split by whitespace and filter out empty items
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}

