"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import WeeklyChart from "@/components/WeeklyChart";
import { DashboardResponse, DashboardRange } from "@/lib/types";
import { formatLastDone, todayStr } from "@/lib/date-helpers";

const RANGE_OPTIONS: { value: DashboardRange; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function DashboardPage() {
  const [range, setRange] = useState<DashboardRange>("week");
  const [refDate, setRefDate] = useState(todayStr());
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback((r: DashboardRange, d: string) => {
    setLoading(true);
    fetch(`/api/dashboard?range=${r}&date=${d}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    load(range, refDate);
  }, [range, refDate, load]);

  function changeRange(r: DashboardRange) {
    setRange(r);
    setRefDate(todayStr());
  }

  const atToday = data ? isSamePeriodAsToday(range, refDate) : true;

  function isSamePeriodAsToday(r: DashboardRange, d: string) {
    // Cheap check: only meaningful for disabling "next" beyond today.
    const today = new Date(todayStr());
    const ref = new Date(d);
    if (r === "week") {
      const diffDays = Math.floor((today.getTime() - ref.getTime()) / 86400000);
      return diffDays >= 0 && diffDays < 7;
    }
    if (r === "month") {
      return today.getFullYear() === ref.getFullYear() && today.getMonth() === ref.getMonth();
    }
    return today.getFullYear() === ref.getFullYear();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Progress</h1>
        <Link
          href="/log"
          className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800"
        >
          + Log entry
        </Link>
      </div>

      <div className="flex items-center justify-between bg-white border rounded-xl px-3 py-2">
        <div className="flex gap-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => changeRange(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                range === opt.value
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-neutral-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {data && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRefDate(data.prevDate)}
              className="text-neutral-500 hover:text-neutral-900 px-2 py-1"
              aria-label="Previous"
            >
              ←
            </button>
            <span className="text-sm font-medium whitespace-nowrap">
              {data.rangeLabel}
            </span>
            <button
              onClick={() => setRefDate(data.nextDate)}
              disabled={atToday}
              className="text-neutral-500 hover:text-neutral-900 px-2 py-1 disabled:opacity-30 disabled:hover:text-neutral-500"
              aria-label="Next"
            >
              →
            </button>
          </div>
        )}
      </div>

      {loading && <p className="text-neutral-500">Loading...</p>}

      {!loading && data && data.activities.length === 0 && (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No activities yet</h2>
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
      )}

      {!loading &&
        data &&
        data.activities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white rounded-xl border p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: activity.color }}
                  />
                  <h2 className="font-semibold">{activity.name}</h2>
                </div>
                {activity.description && (
                  <p className="text-sm text-neutral-600">
                    {activity.description}
                  </p>
                )}
                <p className="text-sm text-neutral-500">
                  Last done: {formatLastDone(activity.lastDoneDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  {activity.periodTotal} {activity.unit}
                </p>
                <p className="text-xs text-neutral-500">
                  {activity.periodCount}{" "}
                  {activity.periodCount === 1 ? "time" : "times"} this{" "}
                  {data.range}
                </p>
              </div>
            </div>
            <WeeklyChart
              points={activity.points}
              unit={activity.unit}
              color={activity.color}
            />
          </div>
        ))}
    </div>
  );
}
