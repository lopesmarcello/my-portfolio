export default function CurriculumPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <main className="w-full max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col gap-8">
          <header>
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              Curriculum
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Resume and professional experience
            </p>
          </header>

          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Experience
              </h2>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Position Title
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Company Name | Year - Year
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Experience description will appear here
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Education
              </h2>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-green-500">
                  <h3 className="text-lg font-semibold text-black dark:text-white">
                    Degree
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Institution | Year
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                  Skill 1
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                  Skill 2
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                  Skill 3
                </span>
              </div>
            </div>
          </section>

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
