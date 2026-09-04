"use client";

import { useEffect, useState } from "react";
import { Entry } from "@/lib/types";
import { format, parseISO } from "date-fns";

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  function loadEntries() {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      });
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleDelete(id: number) {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/entries/${id}`, { method: "DELETE" });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  if (loading) {
    return <p className="text-neutral-500">Loading...</p>;
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <h1 className="text-xl font-semibold mb-2">No entries yet</h1>
        <p className="text-neutral-500">
          Once you log some activity, it will show up here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">History</h1>
      <div className="bg-white border rounded-xl divide-y">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {entry.activityName}: {entry.quantity} {entry.activityUnit}
              </p>
              <p className="text-sm text-neutral-500">
                {format(parseISO(entry.date), "EEE, MMM d, yyyy")}
                {entry.notes ? ` — ${entry.notes}` : ""}
              </p>
            </div>
            <button
              onClick={() => handleDelete(entry.id)}
              className="text-sm text-red-600 hover:underline shrink-0 ml-4"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
