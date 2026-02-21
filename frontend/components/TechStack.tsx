import { Technology } from "@/lib/api";

interface TechStackProps {
    technologies: Technology[];
}

export default function TechStack({ technologies }: TechStackProps) {
    return (
        <div className="py-12">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                    Tech Stack
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Technologies I work with
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex flex-col items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-green-500 dark:hover:border-green-400 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden group-hover:bg-green-50 dark:group-hover:bg-green-950 transition-colors">
                                {tech.imageUrl ? (
                                    <img
                                        src={tech.imageUrl}
                                        alt={tech.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600" />
                                )}
                            </div>
                            <span className="text-sm font-semibold text-center text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
