"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { useState } from "react";
import FreeSlots from "@/components/FreeSlots";
import TimezoneSelector from "@/components/TimezoneSelector";
import DateRangePicker from "@/components/DateRangePicker";
import { FreeSlot } from "@/lib/types";

function getDefaultDates() {
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  return { start: fmt(today), end: fmt(end) };
}

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const defaults = getDefaultDates();

  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);
  const [timezone, setTimezone] = useState("America/New_York");
  const [workingStart, setWorkingStart] = useState("09:00");
  const [workingEnd, setWorkingEnd] = useState("17:00");
  const [includeWeekends, setIncludeWeekends] = useState(false);

  const [slots, setSlots] = useState<FreeSlot[] | null>(null);
  const [eventsFound, setEventsFound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFetch() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startDate,
        endDate,
        timezone,
        workingHoursStart: workingStart,
        workingHoursEnd: workingEnd,
        includeWeekends: String(includeWeekends),
      });
      const res = await fetch(`/api/calendar/free-slots?${params}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setSlots(data.slots);
      setEventsFound(data.eventsFound);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <main className="max-w-[680px] mx-auto px-6 py-16">
        <div className="text-center text-apple-gray-light">Loading...</div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="max-w-[680px] mx-auto px-6 py-16 text-center">
        <h1 className="text-[32px] font-semibold tracking-tight mb-3">
          CalendarFree
        </h1>
        <p className="text-[17px] text-apple-gray-mid mb-8">
          Connect your Google Calendar to instantly find your free meeting slots
          in any timezone.
        </p>
        <SignInButton mode="modal">
          <button className="inline-flex items-center justify-center rounded-full bg-apple-blue text-white text-[15px] font-medium px-6 py-3 hover:bg-apple-blue-hover transition-colors">
            Sign in with Google
          </button>
        </SignInButton>
      </main>
    );
  }

  return (
    <main className="max-w-[680px] mx-auto px-6 py-10">
      <h1 className="text-[28px] font-semibold tracking-tight mb-8">
        Find Free Slots
      </h1>

      <div className="space-y-6">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />

        <TimezoneSelector timezone={timezone} onChange={setTimezone} />

        <div className="flex flex-col sm:flex-row gap-5">
          <div className="flex-1">
            <label
              htmlFor="working-start"
              className="block text-[12px] font-medium text-apple-gray-light uppercase tracking-wider mb-2"
            >
              Working hours start
            </label>
            <input
              id="working-start"
              type="time"
              value={workingStart}
              onChange={(e) => setWorkingStart(e.target.value)}
              className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="working-end"
              className="block text-[12px] font-medium text-apple-gray-light uppercase tracking-wider mb-2"
            >
              Working hours end
            </label>
            <input
              id="working-end"
              type="time"
              value={workingEnd}
              onChange={(e) => setWorkingEnd(e.target.value)}
              className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={includeWeekends}
            onChange={(e) => setIncludeWeekends(e.target.checked)}
            className="w-4 h-4 rounded border-apple-gray-border text-apple-blue focus:ring-apple-blue/20"
          />
          <span className="text-[15px] text-apple-gray-mid">
            Include weekends
          </span>
        </label>

        <button
          onClick={handleFetch}
          disabled={loading}
          className="w-full rounded-xl bg-apple-blue text-white text-[15px] font-medium py-3 hover:bg-apple-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Finding free slots..." : "Find Free Slots"}
        </button>

        {error && (
          <div className="rounded-xl bg-apple-red/10 border border-apple-red/20 px-4 py-3 text-[14px] text-apple-red">
            {error}
          </div>
        )}

        {slots && <FreeSlots slots={slots} eventsFound={eventsFound} timezone={timezone} />}
      </div>
    </main>
  );
}
