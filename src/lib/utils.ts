import { differenceInMonths, differenceInYears, format } from "date-fns";

export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
import { ja } from "date-fns/locale";
import type { Artwork, Child, MonthGroup } from "@/types";

export function getAge(birthday: Date, atDate: Date = new Date()): string {
  const years = differenceInYears(atDate, birthday);
  const months = differenceInMonths(atDate, birthday) % 12;
  return `${years}歳${months}ヶ月`;
}

export function getAgeAtMonth(
  birthday: Date,
  year: number,
  month: number
): string {
  const atDate = new Date(year, month - 1, 15);
  if (atDate < birthday) return "";
  return getAge(birthday, atDate);
}

export function formatMonthYear(year: number, month: number): string {
  const date = new Date(year, month - 1, 1);
  return format(date, "yyyy年M月", { locale: ja });
}

export function formatMonthEnglish(month: number): string {
  const date = new Date(2024, month - 1, 1);
  return format(date, "MMMM");
}

export function groupArtworksByMonth(artworks: Artwork[]): MonthGroup[] {
  const groups: Record<string, MonthGroup> = {};

  artworks.forEach((artwork) => {
    const date = new Date(artwork.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!groups[key]) {
      groups[key] = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        artworks: [],
      };
    }
    groups[key].artworks.push(artwork);
  });

  return Object.values(groups).sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case "drawing":
      return "絵 🎨";
    case "craft":
      return "工作 ✂️";
    case "other":
      return "その他";
    default:
      return category;
  }
}

export function getCategoryEmoji(category: string): string {
  switch (category) {
    case "drawing":
      return "🎨";
    case "craft":
      return "✂️";
    default:
      return "🌟";
  }
}

export function getAvailableMonths(artworks: Artwork[]): { year: number; month: number }[] {
  const set = new Set<string>();
  artworks.forEach((a) => {
    const d = new Date(a.date);
    set.add(`${d.getFullYear()}-${d.getMonth() + 1}`);
  });
  return Array.from(set)
    .map((s) => {
      const [year, month] = s.split("-").map(Number);
      return { year, month };
    })
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
}
