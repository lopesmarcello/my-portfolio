"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, FileText, BookOpen, AlertCircle } from "lucide-react";
import { getAbout, getResume, getPosts } from "@/lib/api";
import type { AboutData, ResumeData, Post } from "@/lib/api";

function CardSkeleton() {
  return (
    <div className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function ErrorBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 mt-2">
      <AlertCircle size={12} />
      Could not load preview
    </span>
  );
}

export default function DashboardPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [aboutError, setAboutError] = useState(false);
  const [resumeError, setResumeError] = useState(false);
  const [postsError, setPostsError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getAbout(), getResume(), getPosts()]).then(([a, r, p]) => {
      if (a.status === "fulfilled") setAbout(a.value);
      else setAboutError(true);
      if (r.status === "fulfilled") setResume(r.value);
      else setResumeError(true);
      if (p.status === "fulfilled") setPosts(p.value);
      else setPostsError(true);
      setLoading(false);
    });
  }, []);

  const mostRecentExp = resume?.experiences?.[0] ?? null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back. Manage your portfolio content below.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* About Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Link
            href="/admin/about"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <User size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
            </div>
            {about ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{about.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{about.title}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mt-1">
                  {about.aboutText?.slice(0, 100)}{(about.aboutText?.length ?? 0) > 100 ? "…" : ""}
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">Edit bio, tech stack, and social links</p>
                {aboutError && <ErrorBadge />}
              </>
            )}
          </Link>
        )}

        {/* Resume Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Link
            href="/admin/resume"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <FileText size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Resume</h2>
            </div>
            {resume ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{resume.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {resume.experiences?.length ?? 0} experience{resume.experiences?.length !== 1 ? "s" : ""}
                </p>
                {mostRecentExp && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {mostRecentExp.companyName}
                    {" · "}
                    {mostRecentExp.startDate}
                    {" – "}
                    {mostRecentExp.endDate ?? "Present"}
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage experiences and CV data</p>
                {resumeError && <ErrorBadge />}
              </>
            )}
          </Link>
        )}

        {/* Posts Card */}
        {loading ? (
          <CardSkeleton />
        ) : (
          <Link
            href="/admin/posts"
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <BookOpen size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Blog Posts</h2>
            </div>
            {posts ? (
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {posts.length} post{posts.length !== 1 ? "s" : ""} published
                </p>
                <ul className="mt-1 space-y-0.5">
                  {posts.slice(0, 3).map((post) => (
                    <li key={post.id} className="text-xs text-gray-400 dark:text-gray-500 truncate">
                      · {post.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create and manage blog content</p>
                {postsError && <ErrorBadge />}
              </>
            )}
          </Link>
        )}
      </div>
    </div>
  );
}
