"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Check } from "lucide-react";
import { getPost } from "@/lib/api";
import { adminUpdatePost } from "@/lib/adminApi";
import RichTextEditor from "@/components/RichTextEditor";
import type { Post } from "@/lib/api";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = parseInt(params.id, 10);

  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(postId)) {
      router.push("/admin/posts");
      return;
    }
    getPost(postId)
      .then((data) => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
      })
      .catch(() => setError("Failed to load post."))
      .finally(() => setLoading(false));
  }, [postId, router]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await adminUpdatePost(postId, { title, content });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500 dark:text-gray-400">Loading…</div>;
  }

  if (!post && !loading) {
    return (
      <div className="p-8">
        <p className="text-red-600 dark:text-red-400 text-sm mb-4">{error ?? "Post not found."}</p>
        <Link href="/admin/posts" className="text-sm text-green-600 hover:underline">
          ← Back to posts
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/posts"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Post</h1>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          {/* key forces re-mount only when the post id changes so the editor initializes with the loaded content */}
          <RichTextEditor key={postId} defaultValue={content} onChange={setContent} />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Link
          href="/admin/posts"
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
        >
          Back to list
        </Link>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 rounded-lg transition-colors"
        >
          {saved ? <Check size={15} /> : <Save size={15} />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Post"}
        </button>
      </div>
    </div>
  );
}
