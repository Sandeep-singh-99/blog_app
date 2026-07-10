import BlogDashboard from '@/components/dashboard/blog-dashboard'
import React from 'react'
import type { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Monitor your posts, analytics, bookmarks, and connections on the BitWrite creator dashboard.",
};

export default function Dashboard() {
  return (
    <div>
        <BlogDashboard/>
    </div>
  )
}
