import { ExperienceData } from "@/lib/api";
import { formatDateRange } from "@/lib/utils";

interface ExperienceCardProps {
  experience: ExperienceData;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <div className="border-l-4 border-green-500 pl-6 py-4">
      <h3 className="text-xl font-bold text-black dark:text-white">
        {experience.companyName}
      </h3>
      <p className="text-green-600 dark:text-green-400 font-semibold mt-1">
        {formatDateRange(experience.startDate, experience.endDate)}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
        {experience.description}
      </p>
    </div>
  );
}
