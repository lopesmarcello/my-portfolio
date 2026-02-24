import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Post | Marcello Lopes",
  description: "Read this post on Marcello Lopes' blog",
};

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
