"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity } from "@/lib/types";
import { todayStr } from "@/lib/date-helpers";

export default function LogEntryPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityId, setActivityId] = useState<string>("");
  const [date, setDate] = useState(todayStr());
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [showNewActivity, setShowNewActivity] = useState(false);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showManage, setShowManage] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [manageError, setManageError] = useState("");

  function loadActivities() {
    fetch("/api/activities")
      .then((res) => res.json())
      .then((list: Activity[]) => {
        setActivities(list);
        if (list.length > 0 && !activityId) {
          setActivityId(String(list[0].id));
        }
        if (list.length === 0) {
          setShowNewActivity(true);
        }
      });
  }

  useEffect(() => {
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAddActivity() {
    setError("");
    if (!newName.trim() || !newUnit.trim()) {
      setError("Please enter both a name and a unit for the new activity.");
      return;
    }
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newName,
        unit: newUnit,
        description: newDescription,
      }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "Something went wrong.");
      return;
    }
    const created: Activity = await res.json();
    setNewName("");
    setNewUnit("");
    setNewDescription("");
    setShowNewActivity(false);
    setActivities((prev) => [...prev, created]);
    setActivityId(String(created.id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!activityId) {
      setError("Please choose an activity.");
      return;
    }
    if (!quantity || Number(quantity) < 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityId: Number(activityId),
        date,
        quantity: Number(quantity),
        notes,
      }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "Something went wrong.");
      return;
    }

    setQuantity("");
    setNotes("");
    setSuccess(true);
    router.refresh();
  }

  function startEdit(activity: Activity) {
    setEditingId(activity.id);
    setEditName(activity.name);
    setEditUnit(activity.unit);
    setEditDescription(activity.description ?? "");
    setManageError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setManageError("");
  }

  async function saveEdit(id: number) {
    setManageError("");
    if (!editName.trim() || !editUnit.trim()) {
      setManageError("Name and unit are required.");
      return;
    }
    const res = await fetch(`/api/activities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        unit: editUnit,
        description: editDescription,
      }),
    });
    if (!res.ok) {
      const json = await res.json();
      setManageError(json.error || "Something went wrong.");
      return;
    }
    const updated: Activity = await res.json();
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? updated : a))
    );
    setEditingId(null);
  }

  async function handleDeleteActivity(id: number) {
    if (
      !confirm(
        "Delete this activity? This will also delete all of its logged entries."
      )
    )
      return;
    await fetch(`/api/activities/${id}`, { method: "DELETE" });
    setActivities((prev) => prev.filter((a) => a.id !== id));
    if (String(id) === activityId) {
      setActivityId("");
    }
  }

  const selectedActivity = activities.find((a) => String(a.id) === activityId);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Log an entry</h1>

      {activities.length > 0 && (
        <div className="bg-white border rounded-xl p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Activity</label>
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              {activities.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.unit})
                </option>
              ))}
            </select>
            {selectedActivity?.description && (
              <p className="text-sm text-neutral-500 mt-1">
                {selectedActivity.description}
              </p>
            )}
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => setShowNewActivity((v) => !v)}
                className="text-sm text-neutral-500 underline"
              >
                + Add a new activity
              </button>
              <button
                type="button"
                onClick={() => setShowManage((v) => !v)}
                className="text-sm text-neutral-500 underline"
              >
                Manage activities
              </button>
            </div>
          </div>
        </div>
      )}

      {showManage && (
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h2 className="font-medium text-sm">Manage activities</h2>
          {manageError && <p className="text-sm text-red-600">{manageError}</p>}
          <div className="space-y-3">
            {activities.map((a) => (
              <div key={a.id} className="border rounded-lg p-3">
                {editingId === a.id ? (
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Name
                      </label>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full border rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Unit
                      </label>
                      <input
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value)}
                        className="w-full border rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        className="w-full border rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => saveEdit(a.id)}
                        className="bg-neutral-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neutral-800"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-sm text-neutral-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">
                        {a.name} ({a.unit})
                      </p>
                      {a.description && (
                        <p className="text-sm text-neutral-500">
                          {a.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(a)}
                        className="text-sm text-neutral-600 underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(a.id)}
                        className="text-sm text-red-600 underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showNewActivity && (
        <div className="bg-white border rounded-xl p-4 space-y-3">
          <h2 className="font-medium text-sm">New activity</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Push-ups"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit</label>
            <input
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="e.g. reps, km, minutes"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description (optional)
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={2}
              placeholder="e.g. Standard push-ups, chest to floor"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <button
            type="button"
            onClick={handleAddActivity}
            className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800"
          >
            Save activity
          </button>
        </div>
      )}

      {activities.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-4 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Quantity {selectedActivity ? `(${selectedActivity.unit})` : ""}
            </label>
            <input
              type="number"
              min="0"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Anything worth remembering about today..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <p className="text-sm text-green-600">Entry saved!</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-neutral-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save entry"}
          </button>
        </form>
      )}
    </div>
  );
}
