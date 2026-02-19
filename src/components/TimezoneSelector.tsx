"use client";

const MAJOR_TIMEZONES = [
  { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
  { value: "America/Anchorage", label: "Alaska (AKST)" },
  { value: "America/Los_Angeles", label: "Pacific (PST)" },
  { value: "America/Denver", label: "Mountain (MST)" },
  { value: "America/Chicago", label: "Central (CST)" },
  { value: "America/New_York", label: "Eastern (EST)" },
  { value: "America/Sao_Paulo", label: "Brasilia (BRT)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Central Europe (CET)" },
  { value: "Europe/Helsinki", label: "Eastern Europe (EET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "New Zealand (NZST)" },
  { value: "UTC", label: "UTC" },
];

interface TimezoneSelectorProps {
  timezone: string;
  onChange: (tz: string) => void;
}

export default function TimezoneSelector({
  timezone,
  onChange,
}: TimezoneSelectorProps) {
  return (
    <div>
      <label
        htmlFor="timezone"
        className="block text-[13px] font-medium text-apple-gray-mid mb-2"
      >
        Timezone
      </label>
      <select
        id="timezone"
        value={timezone}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-apple-gray-bg border border-transparent px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:bg-white focus:border-apple-blue/40 focus:ring-4 focus:ring-apple-blue/10 transition-all duration-150 appearance-none cursor-pointer"
      >
        {MAJOR_TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}
