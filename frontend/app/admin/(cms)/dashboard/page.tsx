import Link from "next/link";
import { User, FileText, BookOpen } from "lucide-react";

const sections = [
  {
    href: "/admin/about",
    label: "About",
    description: "Edit bio, tech stack, and social links",
    icon: User,
  },
  {
    href: "/admin/resume",
    label: "Resume",
    description: "Manage experiences and CV data",
    icon: FileText,
  },
  {
    href: "/admin/posts",
    label: "Blog Posts",
    description: "Create and manage blog content",
    icon: BookOpen,
  },
];

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Welcome back. Manage your portfolio content below.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="block p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg text-green-700 dark:text-green-400 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 transition-colors">
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{label}</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
