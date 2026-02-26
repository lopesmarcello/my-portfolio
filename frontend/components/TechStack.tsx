import Image from "next/image";
import { Technology } from "@/lib/api";

interface TechStackProps {
    technologies: Technology[];
}

export default function TechStack({ technologies }: TechStackProps) {
    return (
        <div className="py-6">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-4">
                    Tecnologias &amp; Ferramentas
                </p>
                <div className="flex flex-wrap gap-5">
                    {technologies.map((tech) => (
                        <div
                            key={tech.name}
                            className="inline-flex items-center gap-1.5 group cursor-default"
                            title={tech.name}
                        >
                            {tech.imageUrl ? (
                                <Image
                                    src={tech.imageUrl}
                                    alt={tech.name}
                                    width={18}
                                    height={18}
                                    className="object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-200"
                                />
                            ) : (
                                <div className="w-4 h-4 rounded-sm bg-gray-400 dark:bg-gray-600 opacity-40 group-hover:opacity-70 transition-opacity duration-200" />
                            )}
                            <span className="text-xs text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
