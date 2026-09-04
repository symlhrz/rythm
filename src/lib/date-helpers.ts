import { differenceInCalendarDays, parseISO, format } from "date-fns";

export function formatLastDone(dateStr: string | null): string {
  if (!dateStr) return "Never logged yet";

  const date = parseISO(dateStr);
  const days = differenceInCalendarDays(new Date(), date);

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days > 1 && days < 7) return `${days} days ago`;
  return format(date, "MMM d, yyyy");
}

export function todayStr(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDayLabel(dateStr: string): string {
  return format(parseISO(dateStr), "EEE");
}
