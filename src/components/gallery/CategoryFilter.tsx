"use client";

import type { Category } from "@/types";

type FilterCategory = Category | "all";

interface CategoryFilterProps {
  selected: FilterCategory;
  onSelect: (category: FilterCategory) => void;
}

const filters: { value: FilterCategory; label: string; activeColor: string }[] =
  [
    { value: "all", label: "ぜんぶ", activeColor: "bg-terracotta" },
    { value: "drawing", label: "絵 🎨", activeColor: "bg-sky" },
    { value: "craft", label: "工作 ✂️", activeColor: "bg-sage" },
    { value: "other", label: "その他 🌟", activeColor: "bg-sand" },
  ];

export default function CategoryFilter({
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      {filters.map(({ value, label, activeColor }) => {
        const isSelected = selected === value;
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isSelected
                ? `${activeColor} text-white shadow-sm`
                : "border border-cocoa/15 text-cocoa-light hover:bg-sand/40"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
