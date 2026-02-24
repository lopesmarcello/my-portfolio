import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curriculum | Marcello Lopes",
  description: "Resume and work experience of Marcello Lopes, Software Engineer",
};

export default function CurriculumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
