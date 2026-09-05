export type Activity = {
  id: number;
  name: string;
  unit: string;
  description: string | null;
  color: string;
  createdAt: string;
};

export type Entry = {
  id: number;
  date: string;
  quantity: number;
  notes: string | null;
  activityId: number;
  activityName: string;
  activityUnit: string;
};

export type ChartPoint = {
  label: string;
  total: number;
};

export type DashboardRange = "week" | "month" | "year";

export type DashboardActivity = {
  id: number;
  name: string;
  unit: string;
  description: string | null;
  color: string;
  points: ChartPoint[];
  periodTotal: number;
  periodCount: number;
  lastDoneDate: string | null;
};

export type DashboardResponse = {
  range: DashboardRange;
  rangeLabel: string;
  refDate: string;
  prevDate: string;
  nextDate: string;
  activities: DashboardActivity[];
};
