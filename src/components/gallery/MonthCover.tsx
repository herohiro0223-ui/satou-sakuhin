import { formatMonthEnglish, getAgeAtMonth } from "@/lib/utils";
import type { Child } from "@/types";

interface MonthCoverProps {
  year: number;
  month: number;
  children: Child[];
}

export default function MonthCover({
  year,
  month,
  children,
}: MonthCoverProps) {
  const monthName = formatMonthEnglish(month);

  return (
    <div className="relative mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-sand via-cream to-sand p-6 shadow-sm">
      {/* Decorative dots */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-terracotta/8" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-sage/8" />
        <div className="absolute right-12 top-16 h-2 w-2 rounded-full bg-coral/30" />
        <div className="absolute left-10 top-8 h-1.5 w-1.5 rounded-full bg-sky/30" />
        <div className="absolute bottom-10 right-8 h-1.5 w-1.5 rounded-full bg-terracotta/25" />
        <div className="absolute bottom-16 left-20 h-2 w-2 rounded-full bg-sage/25" />
        <div className="absolute right-24 top-6 h-1 w-1 rounded-full bg-coral/20" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Month name in English (large) */}
        <h2 className="text-4xl font-bold tracking-wide text-terracotta">
          {monthName}
        </h2>
        {/* Year below */}
        <p className="mt-0.5 text-base text-cocoa-light">{year}</p>

        {/* Children info at bottom */}
        <div className="mt-5 flex flex-wrap gap-3">
          {children.map((child) => {
            const age = getAgeAtMonth(child.birthday, year, month);
            if (!age) return null;
            return (
              <div
                key={child.id}
                className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1 backdrop-blur-sm"
              >
                <span className="text-base">{child.emoji}</span>
                <span className="text-sm font-medium text-cocoa">
                  {child.name}
                </span>
                <span className="text-xs text-cocoa-light">{age}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
