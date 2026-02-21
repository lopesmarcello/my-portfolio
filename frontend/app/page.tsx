export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <main className="w-full max-w-4xl px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              Welcome to My Portfolio
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore my work, experience, and skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/content"
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                Content
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse my articles and blog posts
              </p>
            </a>

            <a
              href="/curriculum"
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
                Curriculum
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                View my resume and experience
              </p>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
