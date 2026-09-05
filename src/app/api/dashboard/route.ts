import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, entries } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addYears,
  subYears,
  format,
  parseISO,
  isWithinInterval,
} from "date-fns";

type Range = "week" | "month" | "year";

function getInterval(range: Range, refDate: Date) {
  if (range === "week") {
    return {
      start: startOfWeek(refDate, { weekStartsOn: 1 }),
      end: endOfWeek(refDate, { weekStartsOn: 1 }),
    };
  }
  if (range === "month") {
    return { start: startOfMonth(refDate), end: endOfMonth(refDate) };
  }
  return { start: startOfYear(refDate), end: endOfYear(refDate) };
}

function getRangeLabel(range: Range, start: Date, end: Date) {
  if (range === "week") {
    const sameMonth = start.getMonth() === end.getMonth();
    return sameMonth
      ? `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`
      : `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }
  if (range === "month") {
    return format(start, "MMMM yyyy");
  }
  return format(start, "yyyy");
}

function shiftDate(range: Range, refDate: Date, direction: 1 | -1) {
  if (range === "week") {
    return direction === 1 ? addWeeks(refDate, 1) : subWeeks(refDate, 1);
  }
  if (range === "month") {
    return direction === 1 ? addMonths(refDate, 1) : subMonths(refDate, 1);
  }
  return direction === 1 ? addYears(refDate, 1) : subYears(refDate, 1);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = (searchParams.get("range") as Range) || "week";
  const dateParam = searchParams.get("date");
  const refDate = dateParam ? parseISO(dateParam) : new Date();

  const { start, end } = getInterval(range, refDate);
  const rangeLabel = getRangeLabel(range, start, end);
  const prevDate = format(shiftDate(range, refDate, -1), "yyyy-MM-dd");
  const nextDate = format(shiftDate(range, refDate, 1), "yyyy-MM-dd");

  const allActivities = await db
    .select()
    .from(activities)
    .orderBy(asc(activities.name));

  // Buckets: daily for week/month, monthly for year
  const buckets =
    range === "year"
      ? eachMonthOfInterval({ start, end }).map((d) => ({
          key: format(d, "yyyy-MM"),
          label: format(d, "MMM"),
        }))
      : eachDayOfInterval({ start, end }).map((d) => ({
          key: format(d, "yyyy-MM-dd"),
          label: range === "week" ? format(d, "EEE") : format(d, "d"),
        }));

  const result = [];

  for (const activity of allActivities) {
    const activityEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.activityId, activity.id));

    const inRange = activityEntries.filter((e) =>
      isWithinInterval(parseISO(e.date), { start, end })
    );

    const points = buckets.map((bucket) => {
      const total = inRange
        .filter((e) =>
          range === "year" ? e.date.startsWith(bucket.key) : e.date === bucket.key
        )
        .reduce((sum, e) => sum + e.quantity, 0);
      return { label: bucket.label, total };
    });

    const periodTotal = points.reduce((sum, p) => sum + p.total, 0);

    const lastEntry = activityEntries
      .slice()
      .sort((a, b) => (a.date > b.date ? -1 : 1))[0];

    result.push({
      id: activity.id,
      name: activity.name,
      unit: activity.unit,
      description: activity.description,
      color: activity.color,
      points,
      periodTotal,
      lastDoneDate: lastEntry ? lastEntry.date : null,
    });
  }

  return NextResponse.json({
    range,
    rangeLabel,
    refDate: format(refDate, "yyyy-MM-dd"),
    prevDate,
    nextDate,
    activities: result,
  });
}
