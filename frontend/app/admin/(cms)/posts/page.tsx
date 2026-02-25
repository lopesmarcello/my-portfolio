"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getPosts } from "@/lib/api";
import { adminDeletePost } from "@/lib/adminApi";
import type { Post } from "@/lib/api";

export default function PostsAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data))
      .catch(() => toast.error("Failed to load posts."))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteClick = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = async (id: number) => {
    setDeletingId(id);
    setConfirmDeleteId(null);
    try {
      await adminDeletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted successfully");
    } catch {
      toast.error("Failed to delete post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const truncate = (text: string, maxLen: number) => {
    const plain = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    return plain.length > maxLen ? plain.slice(0, maxLen) + "…" : plain;
  };

  if (loading) {
    return <div className="p-8 text-gray-500 dark:text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage and edit your blog content.</p>

      {posts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={15} />
            Create your first post
          </Link>
        </div>
      )}

      {posts.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {posts.map((post) => (
            <div key={post.id} className="p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {post.title}
                  </h2>
                  <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(post.createdAt)}
                  </span>
                </div>
                {post.content && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {truncate(post.content, 200)}
                  </p>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Pencil size={13} />
                  Edit
                </Link>

                {confirmDeleteId === post.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDeleteConfirm(post.id)}
                      disabled={deletingId === post.id}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg transition-colors"
                    >
                      {deletingId === post.id ? "Deleting…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(post.id)}
                    disabled={deletingId === post.id}
                    className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 disabled:opacity-60 transition-colors"
                    aria-label="Delete post"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
