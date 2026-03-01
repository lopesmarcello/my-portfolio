/**
 * Format date to readable string format
 * @param dateString ISO date string
 * @param format "short" | "long" | "full"
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | null | undefined,
  format: "short" | "long" | "full" = "short"
): string {
  if (!dateString) return "Presente"

  const date = new Date(dateString)

  if (format === "short") {
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
    })
  } else if (format === "long") {
    return date.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } else {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
}

/**
 * Calculate years of experience between two dates
 */
export function calculateYears(
  startDate: string,
  endDate?: string | null
): number {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()

  let years = end.getFullYear() - start.getFullYear()
  const monthDiff = end.getMonth() - start.getMonth()

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && end.getDate() < start.getDate())
  ) {
    years--
  }

  return Math.max(0, years)
}

/**
 * Format date range string
 */
export function formatDateRange(
  startDate: string,
  endDate?: string | null
): string {
  const formattedStart = formatDate(startDate, "short")
  const formattedEnd = formatDate(endDate, "short")

  return `${formattedStart} - ${formattedEnd}`
}

/**
 * Generate excerpt from text
 */
export function generateExcerpt(text: string, maxWords: number = 30): string {
  const words = text.split(" ")
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ") + "..."
}
