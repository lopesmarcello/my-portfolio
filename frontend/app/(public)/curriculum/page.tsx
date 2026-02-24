"use client";

import { useEffect, useState } from "react";
import { getResume, ResumeData } from "@/lib/api";
import ExperienceCard from "@/components/ExperienceCard";
import { Mail, Phone } from "lucide-react";

export default function CurriculumPage() {
    const [resume, setResume] = useState<ResumeData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getResume();
                setResume(data);
            } catch (error) {
                console.error("Failed to fetch resume data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-pulse">
                        <div className="w-24 h-24 bg-green-500 rounded-full opacity-50 mx-auto mb-4" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 dark:text-red-400">Failed to load resume data</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="max-w-4xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-5xl font-bold text-black dark:text-white mb-2">
                        {resume.fullName}
                    </h1>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-6">
                        {resume.title}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        {resume.email && (
                            <a
                                href={`mailto:${resume.email}`}
                                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <Mail size={20} />
                                <span>{resume.email}</span>
                            </a>
                        )}
                        {resume.phone && (
                            <a
                                href={`tel:${resume.phone}`}
                                className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                            >
                                <Phone size={20} />
                                <span>{resume.phone}</span>
                            </a>
                        )}
                    </div>

                    {resume.links && resume.links.length > 0 && (
                        <div className="flex flex-wrap gap-3">
                            {resume.links.map((link) => (
                                <a
                                    key={`${link.label}-${link.url}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium"
                                >
                                    {link.label}
                                    <span>↗</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* About */}
                {resume.about && (
                    <section className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
                            About
                        </h2>
                        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            {resume.about}
                        </p>
                    </section>
                )}

                {/* Experience */}
                {resume.experiences && resume.experiences.length > 0 && (
                    <section className="mb-12 pb-12 border-b border-gray-200 dark:border-gray-800">
                        <h2 className="text-3xl font-bold text-black dark:text-white mb-8">
                            Experience
                        </h2>
                        <div className="space-y-8">
                            {resume.experiences.map((experience) => (
                                <ExperienceCard key={experience.id} experience={experience} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Call to Action */}
                <section className="bg-green-50 dark:bg-green-950 rounded-2xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-4">
                        Interested in working together?
                    </h3>
                    <p className="text-green-800 dark:text-green-200 mb-6">
                        Let's connect and discuss how I can help your project.
                    </p>
                    {resume.email && (
                        <a
                            href={`mailto:${resume.email}`}
                            className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                        >
                            Get in Touch
                        </a>
                    )}
                </section>
            </div>
        </div>
    );
}
