import { NextResponse } from "next/server";
import { db } from "@/db";
import { activities, entries } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { startOfWeek, addDays, format, parseISO } from "date-fns";

export async function GET() {
  const allActivities = await db
    .select()
    .from(activities)
    .orderBy(asc(activities.name));

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd")
  );

  const result = [];

  for (const activity of allActivities) {
    const activityEntries = await db
      .select()
      .from(entries)
      .where(eq(entries.activityId, activity.id));

    // Totals per day of this week
    const dailyTotals = weekDays.map((day) => {
      const total = activityEntries
        .filter((e) => e.date === day)
        .reduce((sum, e) => sum + e.quantity, 0);
      return { date: day, total };
    });

    const weekTotal = dailyTotals.reduce((sum, d) => sum + d.total, 0);

    const lastEntry = activityEntries
      .slice()
      .sort((a, b) => (a.date > b.date ? -1 : 1))[0];

    result.push({
      id: activity.id,
      name: activity.name,
      unit: activity.unit,
      description: activity.description,
      dailyTotals,
      weekTotal,
      lastDoneDate: lastEntry ? lastEntry.date : null,
    });
  }

  return NextResponse.json({ weekStart: weekDays[0], activities: result });
}
