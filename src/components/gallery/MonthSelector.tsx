"use client";

import { useEffect, useRef } from "react";

interface MonthSelectorProps {
  selectedYear: number;
  selectedMonth: number;
  months: { year: number; month: number }[];
  onSelect: (year: number, month: number) => void;
}

export default function MonthSelector({
  selectedYear,
  selectedMonth,
  months,
  onSelect,
}: MonthSelectorProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to center the selected month on mount and when selection changes
  useEffect(() => {
    if (selectedRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const selected = selectedRef.current;
      const scrollLeft =
        selected.offsetLeft -
        container.offsetWidth / 2 +
        selected.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [selectedYear, selectedMonth]);

  /**
   * Format the month label.
   * Shows "YYYY.M" when crossing years (i.e. a different year from the
   * previous item in the list), otherwise just "M月".
   */
  function formatLabel(
    year: number,
    month: number,
    index: number
  ): string {
    // Always show year for the first item, or when the year differs from
    // the previous item in the list.
    if (index === 0) {
      return `${year}.${month}`;
    }
    const prev = months[index - 1];
    if (prev && prev.year !== year) {
      return `${year}.${month}`;
    }
    return `${month}月`;
  }

  return (
    <div
      ref={scrollRef}
      className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-4 py-3"
    >
      {months.map(({ year, month }, index) => {
        const isSelected = year === selectedYear && month === selectedMonth;
        return (
          <button
            key={`${year}-${month}`}
            ref={isSelected ? selectedRef : undefined}
            onClick={() => onSelect(year, month)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? "bg-terracotta text-white shadow-sm"
                : "text-cocoa hover:bg-sand/60"
            }`}
          >
            {formatLabel(year, month, index)}
          </button>
        );
      })}
    </div>
  );
}
