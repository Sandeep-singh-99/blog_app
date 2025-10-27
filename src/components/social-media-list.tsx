"use client";

import React from "react";
import Link from "next/link";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Globe,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SocialLink = {
  id: string;
  socialMediaName: string;
  url: string;
};

type Props = {
  links: SocialLink[];
};

const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
  linkedin: {
    icon: <Linkedin className="w-5 h-5" />,
    color: "hover:text-blue-600",
  },
  twitter: {
    icon: <Twitter className="w-5 h-5" />,
    color: "hover:text-sky-500",
  },
  facebook: {
    icon: <Facebook className="w-5 h-5" />,
    color: "hover:text-blue-700",
  },
  instagram: {
    icon: <Instagram className="w-5 h-5" />,
    color: "hover:text-pink-500",
  },
  github: {
    icon: <Github className="w-5 h-5" />,
    color: "hover:text-gray-900 dark:hover:text-gray-100",
  },
};

export default function SocialMediaList({ links }: Props) {
  if (!links || links.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center">
        No social media links added yet.
      </p>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-4 justify-center mt-3">
        {links.map((link) => {
          const social = iconMap[link.socialMediaName.toLowerCase()] || {
            icon: <Globe className="w-5 h-5" />,
            color: "hover:text-muted-foreground",
          };

          return (
            <Tooltip key={link.id}>
              <TooltipTrigger asChild>
                <Link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-transform transform hover:scale-110 ${social.color}`}
                >
                  <div className="p-2 rounded-full bg-muted hover:bg-accent flex items-center justify-center shadow-sm transition-all">
                    {social.icon}
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs capitalize">
                {link.socialMediaName}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
