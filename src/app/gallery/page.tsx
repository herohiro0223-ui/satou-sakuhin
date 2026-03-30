"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAvailableMonths } from "@/lib/utils";
import { useData } from "@/contexts/DataContext";
import AuthGuard from "@/components/auth/AuthGuard";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import MonthSelector from "@/components/gallery/MonthSelector";
import MonthCover from "@/components/gallery/MonthCover";
import CategoryFilter from "@/components/gallery/CategoryFilter";
import ArtworkGrid from "@/components/gallery/ArtworkGrid";
import EmptyState from "@/components/ui/EmptyState";
import type { Category } from "@/types";

type FilterCategory = Category | "all";

export default function GalleryPage() {
  return (
    <AuthGuard>
      <GalleryContent />
    </AuthGuard>
  );
}

function GalleryContent() {
  const { artworks, children, getChild } = useData();
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("q") || "";

  const availableMonths = useMemo(() => getAvailableMonths(artworks), [artworks]);

  const latestMonth = availableMonths.length > 0 ? availableMonths[0] : null;

  const [selectedYear, setSelectedYear] = useState<number>(
    latestMonth ? latestMonth.year : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    latestMonth ? latestMonth.month : new Date().getMonth() + 1
  );
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>(
    "all"
  );

  const handleMonthChange = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  // Search results (across all months)
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    const q = searchQuery.toLowerCase();
    return artworks.filter((a) => {
      const child = getChild(a.childId);
      return (
        a.title.toLowerCase().includes(q) ||
        (a.memo && a.memo.toLowerCase().includes(q)) ||
        (child && child.name.toLowerCase().includes(q))
      );
    });
  }, [artworks, searchQuery, getChild]);

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const artworkDate = new Date(artwork.date);
      const matchesMonth =
        artworkDate.getFullYear() === selectedYear &&
        artworkDate.getMonth() + 1 === selectedMonth;
      const matchesCategory =
        selectedCategory === "all" || artwork.category === selectedCategory;
      return matchesMonth && matchesCategory;
    });
  }, [artworks, selectedYear, selectedMonth, selectedCategory]);

  // If searching, show search results
  if (searchResults) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />

        <main className="pt-14 pb-20">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-cocoa">
                「{searchQuery}」の けんさくけっか（{searchResults.length}けん）
              </p>
              <button
                onClick={() => router.push("/gallery")}
                className="text-xs text-terracotta font-medium"
              >
                クリア
              </button>
            </div>
          </div>

          <div className="mt-2">
            {searchResults.length > 0 ? (
              <ArtworkGrid artworks={searchResults} children={children} />
            ) : (
              <EmptyState
                emoji="🔍"
                title="みつかりませんでした"
                subtitle="べつの ことばで さがしてみてね"
              />
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main className="pt-14 pb-20">
        <MonthSelector
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          months={availableMonths}
          onSelect={handleMonthChange}
        />

        <MonthCover
          year={selectedYear}
          month={selectedMonth}
          children={children}
        />

        <div className="mt-3">
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        <div className="mt-2">
          {filteredArtworks.length > 0 ? (
            <ArtworkGrid artworks={filteredArtworks} children={children} />
          ) : (
            <EmptyState
              emoji="🎨"
              title="さくひんが ありません"
              subtitle="このつきの さくひんを ついかしてね"
            />
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
