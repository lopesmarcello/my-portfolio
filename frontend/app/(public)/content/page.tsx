"use client";

import { useEffect, useState } from "react";
import { getPosts, Post } from "@/lib/api";
import PostCard from "@/components/PostCard";

export default function ContentPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPosts();
                setPosts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch posts:", err);
                setError("Failed to load posts");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full">
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
                        Content & Blog
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                        Thoughts, tutorials, and insights about web development and technology
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="inline-block animate-pulse">
                                <div className="w-24 h-24 bg-green-500 rounded-full opacity-50 mx-auto mb-4" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg p-6 text-center">
                        <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && posts.length === 0 && (
                    <div className="bg-gray-50 dark:bg-gray-950 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-800">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            No posts yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Check back soon for new articles and tutorials!
                        </p>
                    </div>
                )}

                {/* Posts Grid */}
                {!isLoading && !error && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
