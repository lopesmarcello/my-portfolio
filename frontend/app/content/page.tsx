export default function ContentPage() {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-black">
            <main className="w-full max-w-4xl mx-auto px-6 py-12">
                <div className="flex flex-col gap-8">
                    <header>
                        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                            Content
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Browse articles and blog posts
                        </p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Placeholder for content cards */}
                        <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                                Article Title
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Article excerpt will appear here
                            </p>
                            <time className="text-sm text-gray-500 dark:text-gray-500">
                                Coming soon
                            </time>
                        </article>
                    </div>

                    <nav className="mt-8">
                        <a
                            href="/"
                            className="inline-block px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                            ← Back to Home
                        </a>
                    </nav>
                </div>
            </main>
        </div>
    );
}
