import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Marcello Lopes",
  description: "Thoughts, tutorials, and insights about web development and technology",
};

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
