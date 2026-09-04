"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import WeeklyChart from "@/components/WeeklyChart";
import { DashboardResponse } from "@/lib/types";
import { formatLastDone } from "@/lib/date-helpers";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>;
  }

  if (!data || data.activities.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-semibold mb-2">No activities yet</h1>
        <p className="text-neutral-500 mb-6">
          Add your first activity to start tracking your progress.
        </p>
        <Link
          href="/log"
          className="inline-block bg-neutral-900 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-neutral-800"
        >
          Log your first entry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">This Week</h1>
        <Link
          href="/log"
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800"
        >
          + Log entry
        </Link>
      </div>

      {data.activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-xl border p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">{activity.name}</h2>
              <p className="text-sm text-neutral-500">
                Last done: {formatLastDone(activity.lastDoneDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {activity.weekTotal} {activity.unit}
              </p>
              <p className="text-xs text-neutral-500">this week</p>
            </div>
          </div>
          <WeeklyChart dailyTotals={activity.dailyTotals} unit={activity.unit} />
        </div>
      ))}
    </div>
  );
}
