"use client";

import { useState } from "react";
import { FreeSlot } from "@/lib/types";

type Format = "table" | "text";

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

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "pm" : "am";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
}

function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatDayShort(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  return timezone
    .replace(/_/g, " ")
    .replace(/^(America|Europe|Asia|Australia|Pacific)\//, "");
}

function slotRangeText(slot: FreeSlot): string {
  return `${formatTime(slot.startTime)} – ${formatTime(slot.endTime)}`;
}

// ── Segmented control ──────────────────────────────────────────────────────

function SegmentedControl({
  value,
  onChange,
}: {
  value: Format;
  onChange: (f: Format) => void;
}) {
  const options: { value: Format; label: string }[] = [
    { value: "table", label: "Table" },
    { value: "text", label: "Text" },
  ];
  return (
    <div className="flex bg-apple-gray-bg rounded-lg p-[3px]">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-[5px] rounded-md text-[13px] font-medium transition-all duration-150 cursor-pointer ${
            value === opt.value
              ? "bg-white text-apple-gray-dark shadow-sm"
              : "text-apple-gray-mid hover:text-apple-gray-dark"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Table view ─────────────────────────────────────────────────────────────

function TableView({ grouped }: { grouped: Map<string, FreeSlot[]> }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-apple-gray-border/40">
            <th className="text-left text-[11px] font-semibold text-apple-gray-light uppercase tracking-wider px-5 py-3 w-[22%]">
              Day
            </th>
            <th className="text-left text-[11px] font-semibold text-apple-gray-light uppercase tracking-wider px-5 py-3 w-[20%]">
              Date
            </th>
            <th className="text-left text-[11px] font-semibold text-apple-gray-light uppercase tracking-wider px-5 py-3">
              Available slots
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from(grouped.entries()).map(([date, daySlots], i, arr) => (
            <tr
              key={date}
              className={i < arr.length - 1 ? "border-b border-apple-gray-border/30" : ""}
            >
              <td className="px-5 py-4 text-[14px] font-medium text-apple-gray-dark align-top">
                {formatDayShort(date)}
              </td>
              <td className="px-5 py-4 text-[14px] text-apple-gray-mid align-top whitespace-nowrap">
                {formatDateShort(date)}
              </td>
              <td className="px-5 py-4 align-top">
                <div className="flex flex-col gap-[6px]">
                  {daySlots.map((slot, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <span className="text-[14px] text-apple-gray-dark">
                        {slotRangeText(slot)}
                      </span>
                      <span className="text-[12px] font-medium text-apple-green">
                        {formatDuration(slot.startTime, slot.endTime)}
                      </span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Text view ──────────────────────────────────────────────────────────────

function TextView({ grouped }: { grouped: Map<string, FreeSlot[]> }) {
  const lines = Array.from(grouped.entries()).map(([date, daySlots]) => {
    const label = `${formatDayShort(date)}, ${formatDateShort(date)}`;
    const times = daySlots.map(slotRangeText).join(",  ");
    return `${label}: ${times}`;
  });

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}
    >
      <div className="px-5 py-4 divide-y divide-apple-gray-border/30">
        {lines.map((line, i) => (
          <p
            key={i}
            className="py-3 text-[14px] text-apple-gray-dark leading-relaxed first:pt-0 last:pb-0"
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function FreeSlots({ slots, eventsFound, timezone }: FreeSlotsProps) {
  const [format, setFormat] = useState<Format>("table");
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
      {/* Summary + format toggle */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] text-apple-gray-light">
          <span className="font-medium text-apple-gray-mid">
            {slots.length} slot{slots.length !== 1 ? "s" : ""}
          </span>{" "}
          across{" "}
          <span className="font-medium text-apple-gray-mid">
            {grouped.size} day{grouped.size !== 1 ? "s" : ""}
          </span>
          {" · "}
          {tzLabel(timezone)}
          <span className="text-apple-gray-light/60"> · {eventsFound} events scanned</span>
        </p>
        <SegmentedControl value={format} onChange={setFormat} />
      </div>

      {format === "table" ? (
        <TableView grouped={grouped} />
      ) : (
        <TextView grouped={grouped} />
      )}
    </div>
  );
}
