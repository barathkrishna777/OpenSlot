"use client";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

const inputClass =
  "w-full rounded-xl bg-apple-gray-bg border border-transparent px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:bg-white focus:border-apple-blue/40 focus:ring-4 focus:ring-apple-blue/10 transition-all duration-150";
const labelClass = "block text-[13px] font-medium text-apple-gray-mid mb-2";

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label htmlFor="start-date" className={labelClass}>
          From
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="end-date" className={labelClass}>
          To
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className={inputClass}
        />
      </div>
    </div>
  );
}
