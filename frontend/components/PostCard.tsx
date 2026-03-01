import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/api";
import { formatDate, generateExcerpt } from "@/lib/utils";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <Link href={`/content/${post.id}`}>
            <article className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:border-green-500 dark:hover:border-green-400 transition-all">
                {post.headerImageUrl && (
                    <div className="relative w-full h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                        <Image
                            src={post.headerImageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                )}

                <div className="p-6">
                    <h2 className="text-xl font-bold text-black dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                        {post.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {generateExcerpt(post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(), 25)}
                    </p>

                    <div className="flex items-center justify-between">
                        <time className="text-sm text-gray-500 dark:text-gray-500">
                            {formatDate(post.createdAt, "short")}
                        </time>
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform">
                            Read →
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
