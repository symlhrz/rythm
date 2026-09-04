"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DailyTotal } from "@/lib/types";
import { formatDayLabel } from "@/lib/date-helpers";

export default function WeeklyChart({
  dailyTotals,
  unit,
}: {
  dailyTotals: DailyTotal[];
  unit: string;
}) {
  const chartData = dailyTotals.map((d) => ({
    day: formatDayLabel(d.date),
    total: d.total,
  }));

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, "Total"] as [string, string]}
            cursor={{ fill: "#f5f5f5" }}
          />
          <Bar dataKey="total" fill="#171717" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
