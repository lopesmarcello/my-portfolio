"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPost, Post } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface PostPageProps {
    params: Promise<{ id: string }>;
}

export default function PostPage({ params }: PostPageProps) {
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const loadParams = async () => {
            const awaitedParams = await params;
            setId(awaitedParams.id);
        };
        loadParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const data = await getPost(parseInt(id, 10));
                setPost(data);
            } catch (err) {
                console.error("Failed to fetch post:", err);
                setError("Failed to load this post");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-pulse">
                        <div className="w-24 h-24 bg-green-500 rounded-full opacity-50 mx-auto mb-4" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-16">
                <Link
                    href="/content"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium mb-6"
                >
                    ← Back to Content
                </Link>
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-6 text-center">
                    <p className="text-red-600 dark:text-red-400 font-semibold">
                        {error || "Post not found"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <article className="w-full">
            <div className="max-w-4xl mx-auto px-6 py-16">
                <Link
                    href="/content"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium mb-8"
                >
                    ← Back to Content
                </Link>

                {/* Header Image */}
                {post.headerImageUrl && (
                    <div className="mb-10 -mx-6">
                        <img
                            src={post.headerImageUrl}
                            alt={post.title}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    </div>
                )}

                {/* Article Header */}
                <header className="mb-10">
                    <time className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(post.createdAt, "long")}
                    </time>
                    <h1 className="text-5xl font-bold text-black dark:text-white my-6">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
                        <div>
                            <p className="font-semibold text-black dark:text-white">
                                Marcello Lopes
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Software Engineer
                            </p>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <div className="prose dark:prose-invert max-w-none mb-10">
                    <div className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </div>
                </div>

                {/* Share Section */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                        Share this post
                    </h3>
                    <div className="flex gap-4">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium"
                        >
                            Share on Twitter
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium"
                        >
                            Share on LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </article>
    );
}
