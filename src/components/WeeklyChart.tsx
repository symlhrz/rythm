"use client";

import {
  LineChart,
  Line,
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
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
          <Tooltip
            formatter={(value) => [`${value} ${unit}`, "Total"] as [string, string]}
            cursor={{ stroke: "#e5e5e5" }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#171717"
            strokeWidth={2}
            dot={{ r: 4, fill: "#171717" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
