// import React from 'react'

// export default function SocialMediaList({ links }) {
//   return (
//     <div>SocialMediaList</div>
//   )
// }




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

type SocialLink = {
  id: string;
  socialMediaName: string;
  url: string;
};

type Props = {
  links: SocialLink[];
};

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-5 h-5 text-blue-600" />,
  twitter: <Twitter className="w-5 h-5 text-sky-500" />,
  facebook: <Facebook className="w-5 h-5 text-blue-700" />,
  instagram: <Instagram className="w-5 h-5 text-pink-500" />,
  github: <Github className="w-5 h-5 text-gray-800 dark:text-gray-100" />,
};

export default function SocialMediaList({ links }: Props) {
  if (!links || links.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No social media links added yet.
      </p>
    );
  }

  return (
    <div className="flex gap-3 justify-center mt-2">
      {links.map((link) => {
        const icon =
          iconMap[link.socialMediaName.toLowerCase()] || (
            <Globe className="w-5 h-5 text-muted-foreground" />
          );

        return (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:scale-110 transition-transform"
          >
            {icon}
          </Link>
        );
      })}
    </div>
  );
}
