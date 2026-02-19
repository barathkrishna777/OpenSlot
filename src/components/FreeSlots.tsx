"use client";

import { FreeSlot } from "@/lib/types";

interface FreeSlotsProps {
  slots: FreeSlot[];
  eventsFound: number;
  timezone: string;
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function formatDuration(startTime: string, endTime: string): string {
  const mins = timeToMinutes(endTime) - timeToMinutes(startTime);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function groupByDate(slots: FreeSlot[]): Map<string, FreeSlot[]> {
  const grouped = new Map<string, FreeSlot[]>();
  for (const slot of slots) {
    const existing = grouped.get(slot.date) || [];
    existing.push(slot);
    grouped.set(slot.date, existing);
  }
  return grouped;
}

function tzLabel(timezone: string): string {
  return timezone.replace(/_/g, " ").replace("America/", "").replace("Europe/", "").replace("Asia/", "").replace("Australia/", "").replace("Pacific/", "");
}

export default function FreeSlots({
  slots,
  eventsFound,
  timezone,
}: FreeSlotsProps) {
  const grouped = groupByDate(slots);

  if (slots.length === 0) {
    return (
      <div
        className="bg-white rounded-2xl p-8 text-center"
        style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}
      >
        <p className="text-[17px] font-medium text-apple-gray-dark mb-1">
          No slots available
        </p>
        <p className="text-[14px] text-apple-gray-light">
          {eventsFound} events found. Try adjusting your date range or working hours.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <p className="text-[13px] text-apple-gray-light px-1">
        <span className="font-medium text-apple-gray-mid">{slots.length} slot{slots.length !== 1 ? "s" : ""}</span>
        {" "}across{" "}
        <span className="font-medium text-apple-gray-mid">{grouped.size} day{grouped.size !== 1 ? "s" : ""}</span>
        {" · "}{tzLabel(timezone)}
        <span className="text-apple-gray-light/60"> · {eventsFound} events scanned</span>
      </p>

      {/* Day cards */}
      {Array.from(grouped.entries()).map(([date, daySlots]) => (
        <div
          key={date}
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}
        >
          {/* Date header */}
          <div className="px-5 pt-4 pb-3">
            <h3 className="text-[13px] font-semibold text-apple-gray-light uppercase tracking-wider">
              {formatDate(date)}
            </h3>
          </div>

          {/* Slots */}
          <div className="divide-y divide-apple-gray-border/30">
            {daySlots.map((slot, i) => (
              <div key={i} className="px-5 py-[14px] flex items-center justify-between">
                <span className="text-[15px] font-medium text-apple-gray-dark">
                  {formatTime(slot.startTime)}
                  <span className="text-apple-gray-light font-normal mx-[6px]">–</span>
                  {formatTime(slot.endTime)}
                </span>
                <span className="text-[13px] font-medium text-apple-green tabular-nums">
                  {formatDuration(slot.startTime, slot.endTime)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
