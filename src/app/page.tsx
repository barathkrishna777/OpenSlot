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

const MIN_DURATION_OPTIONS = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" },
  { value: 180, label: "3 hours" },
  { value: 240, label: "4 hours" },
  { value: 300, label: "5 hours" },
];

const inputClass =
  "w-full rounded-xl bg-apple-gray-bg border border-transparent px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:bg-white focus:border-apple-blue/40 focus:ring-4 focus:ring-apple-blue/10 transition-all duration-150";
const labelClass = "block text-[13px] font-medium text-apple-gray-mid mb-2";

export { inputClass, labelClass };

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const defaults = getDefaultDates();

  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);
  const [timezone, setTimezone] = useState("America/New_York");
  const [workingStart, setWorkingStart] = useState("09:00");
  const [workingEnd, setWorkingEnd] = useState("17:00");
  const [includeWeekends, setIncludeWeekends] = useState(false);
  const [minDuration, setMinDuration] = useState(60);

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
        minDuration: String(minDuration),
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
      <div className="min-h-[calc(100vh-44px)] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-apple-blue/20 border-t-apple-blue rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-[calc(100vh-44px)] flex flex-col">
        {/* Hero — Apple section blue background */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center bg-apple-section-blue">
          <p className="text-[12px] font-semibold text-apple-gray-dark/50 uppercase tracking-[0.14em] mb-7">
            OpenSlot
          </p>
          <h1 className="text-[64px] sm:text-[80px] font-semibold tracking-[-0.04em] leading-[1.04] text-apple-gray-dark mb-6 max-w-[760px]">
            Know when<br />you&apos;re free.
          </h1>
          <p className="text-[19px] sm:text-[21px] text-apple-gray-dark/60 leading-[1.55] mb-10 max-w-[460px]">
            Find available slots across every Google Calendar you have —{" "}
            in any timezone, instantly.
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 rounded-full bg-apple-blue text-white text-[17px] font-medium px-8 py-[14px] hover:bg-apple-blue-hover transition-colors duration-200 cursor-pointer">
                Get started
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center rounded-full border border-apple-blue/60 text-apple-blue bg-transparent text-[17px] font-medium px-8 py-[14px] hover:border-apple-blue hover:bg-apple-blue/5 transition-all duration-200 cursor-pointer">
                Learn more
              </button>
            </SignInButton>
          </div>
        </div>

        {/* Feature strip — white background */}
        <div className="bg-white border-t border-apple-gray-border/30">
          <div className="max-w-[860px] mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-0 sm:divide-x divide-apple-gray-border/40">
            <div className="text-center sm:px-10">
              <p className="text-[15px] font-semibold text-apple-gray-dark mb-[6px]">Every calendar</p>
              <p className="text-[13px] text-apple-gray-light leading-relaxed">
                Reads every calendar you have access to — not just your primary one.
              </p>
            </div>
            <div className="text-center sm:px-10">
              <p className="text-[15px] font-semibold text-apple-gray-dark mb-[6px]">Any timezone</p>
              <p className="text-[13px] text-apple-gray-light leading-relaxed">
                View your availability in any timezone for effortless global scheduling.
              </p>
            </div>
            <div className="text-center sm:px-10">
              <p className="text-[15px] font-semibold text-apple-gray-dark mb-[6px]">Your rules</p>
              <p className="text-[13px] text-apple-gray-light leading-relaxed">
                Set working hours, minimum slot size, and whether to include weekends.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-[560px] mx-auto px-6 py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[34px] font-semibold tracking-[-0.025em] text-apple-gray-dark leading-tight">
          Find Free Slots
        </h1>
        <p className="text-[15px] text-apple-gray-light mt-1">
          Across all your calendars
        </p>
      </div>

      {/* Form card */}
      <div
        className="bg-white rounded-2xl overflow-hidden mb-4"
        style={{ boxShadow: "0 2px 24px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)" }}
      >
        <div className="p-6 space-y-5">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartChange={setStartDate}
            onEndChange={setEndDate}
          />

          <TimezoneSelector timezone={timezone} onChange={setTimezone} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="working-start" className={labelClass}>
                Working hours start
              </label>
              <input
                id="working-start"
                type="time"
                value={workingStart}
                onChange={(e) => setWorkingStart(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="working-end" className={labelClass}>
                Working hours end
              </label>
              <input
                id="working-end"
                type="time"
                value={workingEnd}
                onChange={(e) => setWorkingEnd(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="min-duration" className={labelClass}>
              Minimum slot duration
            </label>
            <select
              id="min-duration"
              value={minDuration}
              onChange={(e) => setMinDuration(Number(e.target.value))}
              className={inputClass + " appearance-none cursor-pointer"}
            >
              {MIN_DURATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* iOS-style toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              className="sr-only"
              checked={includeWeekends}
              onChange={(e) => setIncludeWeekends(e.target.checked)}
            />
            <div
              className={`relative w-[42px] h-[26px] rounded-full flex-shrink-0 transition-colors duration-200 ${
                includeWeekends ? "bg-apple-blue" : "bg-apple-gray-border"
              }`}
            >
              <div
                className={`absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                  includeWeekends ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-[15px] text-apple-gray-dark">Include weekends</span>
          </label>
        </div>

        {/* Submit button inside the card */}
        <div className="px-6 pb-6">
          <button
            onClick={handleFetch}
            disabled={loading}
            className="w-full rounded-xl bg-apple-blue text-white text-[15px] font-medium py-[13px] hover:bg-apple-blue-hover transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-[15px] h-[15px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finding slots…
              </span>
            ) : (
              "Find Free Slots"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-apple-red/20 bg-apple-red/5 px-4 py-3 text-[14px] text-apple-red mb-4">
          {error}
        </div>
      )}

      {slots && (
        <FreeSlots slots={slots} eventsFound={eventsFound} timezone={timezone} />
      )}
    </main>
  );
}
