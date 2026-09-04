export type Activity = {
  id: number;
  name: string;
  unit: string;
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

export type DailyTotal = {
  date: string;
  total: number;
};

export type DashboardActivity = {
  id: number;
  name: string;
  unit: string;
  dailyTotals: DailyTotal[];
  weekTotal: number;
  lastDoneDate: string | null;
};

export type DashboardResponse = {
  weekStart: string;
  activities: DashboardActivity[];
};
