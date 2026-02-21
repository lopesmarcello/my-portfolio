import { Technology } from "@/lib/api";

interface TechStackProps {
    technologies: Technology[];
}

export default function TechStack({ technologies }: TechStackProps) {
    return (
        <div className="py-16">
            <div className="max-w-6xl mx-auto px-6">
                <div className="mb-12">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
                        Technologies &amp; Tools
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {technologies.map((tech) => (
                            <div
                                key={tech.name}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100/50 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-800/60 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/40 dark:hover:bg-green-950/30 transition-all duration-200 group cursor-default"
                            >
                                {tech.imageUrl ? (
                                    <img
                                        src={tech.imageUrl}
                                        alt={tech.name}
                                        className="w-5 h-5 object-contain"
                                    />
                                ) : (
                                    <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-green-400 to-green-600" />
                                )}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
