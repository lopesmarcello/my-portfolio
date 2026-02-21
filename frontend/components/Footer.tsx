import { Link as LinkType } from "@/lib/api";

interface FooterProps {
    links?: LinkType[];
}

export default function Footer({ links }: FooterProps) {
    return (
        <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                        Get in touch
                    </h3>
                    {links && links.length > 0 && (
                        <div className="flex flex-wrap gap-4">
                            {links.map((link) => (
                                <a
                                    key={`${link.label}-${link.url}`}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium"
                                >
                                    {link.label}
                                    <span className="text-sm">↗</span>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} Marcello Lopes. Created with Next.js & React.
                    </p>
                </div>
            </div>
        </footer>
    );
}
