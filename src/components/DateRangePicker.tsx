"use client";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangePickerProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5">
      <div className="flex-1">
        <label
          htmlFor="start-date"
          className="block text-[12px] font-medium text-apple-gray-light uppercase tracking-wider mb-2"
        >
          From
        </label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
        />
      </div>
      <div className="flex-1">
        <label
          htmlFor="end-date"
          className="block text-[12px] font-medium text-apple-gray-light uppercase tracking-wider mb-2"
        >
          To
        </label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full rounded-xl border border-apple-gray-border/60 bg-white/70 backdrop-blur-sm px-4 py-3 text-[15px] text-apple-gray-dark focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
        />
      </div>
    </div>
  );
}
