"use client";

import { FreeSlot } from "@/lib/types";

interface FreeSlotsProps {
  slots: FreeSlot[];
  eventsFound: number;
  timezone: string;
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

export default function FreeSlots({
  slots,
  eventsFound,
  timezone,
}: FreeSlotsProps) {
  if (slots.length === 0) {
    return (
      <div className="rounded-2xl bg-white/60 backdrop-blur-sm border border-apple-gray-border/40 p-6 text-center">
        <p className="text-[15px] text-apple-gray-mid">
          No free slots found for this date range.
        </p>
        <p className="text-[13px] text-apple-gray-light mt-1">
          {eventsFound} events found on your calendar.
        </p>
      </div>
    );
  }

  const grouped = groupByDate(slots);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-apple-gray-light">
          {slots.length} free slots found ({eventsFound} events on calendar)
        </p>
        <p className="text-[12px] text-apple-gray-light">
          Times in {timezone.replace(/_/g, " ")}
        </p>
      </div>

      {Array.from(grouped.entries()).map(([date, daySlots]) => (
        <div
          key={date}
          className="rounded-2xl bg-white/60 backdrop-blur-sm border border-apple-gray-border/40 overflow-hidden"
        >
          <div className="px-5 py-3 bg-white/40 border-b border-apple-gray-border/30">
            <h3 className="text-[14px] font-semibold text-apple-gray-dark">
              {formatDate(date)}
            </h3>
          </div>
          <div className="divide-y divide-apple-gray-border/20">
            {daySlots.map((slot, i) => (
              <div
                key={i}
                className="px-5 py-3 flex items-center justify-between"
              >
                <span className="text-[15px] text-apple-gray-dark">
                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                </span>
                <span className="text-[13px] text-apple-green font-medium">
                  Free
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
