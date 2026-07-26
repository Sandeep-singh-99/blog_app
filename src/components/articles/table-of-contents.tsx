"use client";

import React, { useEffect, useState } from "react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Use DOMParser to parse headings from the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
    
    const parsedHeadings: TOCItem[] = [];
    const seenSlugs: Record<string, number> = {};

    headingElements.forEach((el, idx) => {
      const text = el.textContent?.trim() || "";
      if (!text) return;

      const level = parseInt(el.tagName.replace("H", ""), 10);
      
      // Make sure slugification logic matches EditorPreview
      const baseSlug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") || `heading-${idx}`;

      let uniqueSlug = baseSlug;
      if (seenSlugs[baseSlug] === undefined) {
        seenSlugs[baseSlug] = 0;
      } else {
        seenSlugs[baseSlug] += 1;
        uniqueSlug = `${baseSlug}-${seenSlugs[baseSlug]}`;
      }

      parsedHeadings.push({
        id: uniqueSlug,
        text,
        level,
      });
    });

    setHeadings(parsedHeadings);
  }, [content]);

  // Scrollspy to detect active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observerOptions = {
      rootMargin: "0px 0px -70% 0px", // triggers when heading reaches top 30% of viewport
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      // Find the entries that are currently intersecting
      const intersectingEntries = entries.filter((entry) => entry.isIntersecting);
      
      if (intersectingEntries.length > 0) {
        // Pick the top visible heading
        // We can sort them by their distance to the top of viewport to get the most accurate
        const sorted = intersectingEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveId(sorted[0].target.id);
      }
    }, observerOptions);

    headingElements.forEach((el) => observer.observe(el));

    // Fallback: If we scrolled all the way to the top, reset active heading to empty or first
    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveId(headings[0]?.id || "");
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="space-y-4">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Table of Contents
      </h4>
      <div className="relative border-l border-slate-100 pl-px">
        <ul className="space-y-2 text-[13px]">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            
            // Indentation based on heading level
            let plClass = "pl-3";
            if (heading.level === 3) plClass = "pl-6";
            if (heading.level >= 4) plClass = "pl-9";

            return (
              <li key={heading.id} className="relative">
                {isActive && (
                  <span className="absolute left-[-1px] top-0.5 bottom-0.5 w-[2px] bg-blue-600 rounded-full transition-all duration-300" />
                )}
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const targetEl = document.getElementById(heading.id);
                    if (targetEl) {
                      const offset = 80; // offset for sticky headers
                      const bodyRect = document.body.getBoundingClientRect().top;
                      const elementRect = targetEl.getBoundingClientRect().top;
                      const elementPosition = elementRect - bodyRect;
                      const offsetPosition = elementPosition - offset;

                      window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                      });
                      
                      setActiveId(heading.id);
                      window.history.replaceState(null, "", `#${heading.id}`);
                    }
                  }}
                  className={`block py-1 transition-all duration-200 ${plClass} ${
                    isActive
                      ? "text-blue-600 font-semibold leading-snug"
                      : "text-slate-500 hover:text-slate-900 leading-snug"
                  }`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
