"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCategoryLabel, getCategoryEmoji } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import AuthGuard from "@/components/auth/AuthGuard";
import BottomNav from "@/components/ui/BottomNav";
import type { Category } from "@/types";

export default function EditArtworkPage() {
  return (
    <AuthGuard>
      <EditArtworkContent />
    </AuthGuard>
  );
}

function EditArtworkContent() {
  const params = useParams();
  const id = params.id as string;
  const { isHost } = useAuth();
  const { children, getArtwork, updateArtwork } = useData();
  const router = useRouter();

  const artwork = getArtwork(id);

  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("drawing");
  const [location, setLocation] = useState<"幼稚園" | "おうち">("おうち");
  const [date, setDate] = useState("");
  const [memo, setMemo] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isHost) {
      router.replace("/gallery");
    }
  }, [isHost, router]);

  useEffect(() => {
    if (artwork && !initialized) {
      setSelectedChildId(artwork.childId);
      setTitle(artwork.title);
      setCategory(artwork.category);
      setLocation(artwork.location);
      const d = new Date(artwork.date);
      setDate(d.toISOString().split("T")[0]);
      setMemo(artwork.memo ?? "");
      setImagePreview(artwork.imageUrl);
      setInitialized(true);
    }
  }, [artwork, initialized]);

  if (!isHost) return null;

  if (!artwork) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-cocoa text-lg">さくひんが みつかりません</p>
      </div>
    );
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId || !title.trim() || !imagePreview) {
      alert("しゃしん、おなまえ、タイトルを いれてね");
      return;
    }
    const parsedDate = new Date(date);
    updateArtwork(id, {
      childId: selectedChildId,
      title: title.trim(),
      category,
      imageUrl: imagePreview,
      thumbnailUrl: imagePreview,
      location,
      date: parsedDate,
      memo: memo.trim() || undefined,
    });
    router.push(`/artwork/${id}`);
  };

  const categories: Category[] = ["drawing", "craft", "other"];
  const locations: ("幼稚園" | "おうち")[] = ["幼稚園", "おうち"];

  return (
    <div className="min-h-screen bg-cream">
      <header className="fixed top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="flex items-center h-14 px-4">
          <Link
            href={`/artwork/${id}`}
            className="text-cocoa hover:text-terracotta transition-colors mr-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-cocoa">さくひん へんしゅう</h1>
        </div>
      </header>

      <main className="pt-14 pb-20 px-4">
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-cocoa mb-2">
              しゃしん
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square border-2 border-dashed border-cocoa-light rounded-2xl flex flex-col items-center justify-center bg-sand/50 cursor-pointer hover:bg-sand transition-colors overflow-hidden"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cocoa-light mb-2"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                  <span className="text-cocoa-light text-sm font-medium">
                    タップして しゃしんを えらぶ
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Child selector */}
          <div>
            <label className="block text-sm font-medium text-cocoa mb-2">
              だれの さくひん？
            </label>
            <div className="flex gap-3">
              {children.map((child) => (
                <button
                  key={child.id}
                  type="button"
                  onClick={() => setSelectedChildId(child.id)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 px-4 rounded-xl border-2 transition-all ${
                    selectedChildId === child.id
                      ? "border-terracotta bg-terracotta/10 shadow-sm"
                      : "border-cocoa-light/30 bg-white hover:border-cocoa-light"
                  }`}
                >
                  <span className="text-3xl">{child.emoji}</span>
                  <span className="text-sm font-medium text-cocoa">
                    {child.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-cocoa mb-2"
            >
              タイトル
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="さくひんの なまえ"
              className="w-full px-4 py-3 bg-white border border-cocoa-light/30 rounded-xl text-cocoa placeholder:text-cocoa-light/60 focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-cocoa mb-2">
              カテゴリ
            </label>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`flex-1 py-3 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    category === cat
                      ? "border-terracotta bg-terracotta/10 text-cocoa"
                      : "border-cocoa-light/30 bg-white text-cocoa-light hover:border-cocoa-light"
                  }`}
                >
                  <span className="block text-lg mb-0.5">
                    {getCategoryEmoji(cat)}
                  </span>
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-cocoa mb-2">
              ばしょ
            </label>
            <div className="flex gap-3">
              {locations.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                    location === loc
                      ? "border-terracotta bg-terracotta/10 text-cocoa"
                      : "border-cocoa-light/30 bg-white text-cocoa-light hover:border-cocoa-light"
                  }`}
                >
                  {loc === "幼稚園" ? "🏫" : "🏠"} {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-cocoa mb-2"
            >
              ひにち
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-cocoa-light/30 rounded-xl text-cocoa focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta"
            />
          </div>

          {/* Memo */}
          <div>
            <label
              htmlFor="memo"
              className="block text-sm font-medium text-cocoa mb-2"
            >
              メモ
            </label>
            <textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="おもいで や きろく..."
              rows={3}
              className="w-full px-4 py-3 bg-white border border-cocoa-light/30 rounded-xl text-cocoa placeholder:text-cocoa-light/60 focus:outline-none focus:ring-2 focus:ring-terracotta/50 focus:border-terracotta resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-coral text-white rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-md"
          >
            ほぞんする
          </button>
        </form>
      </main>

      <BottomNav />
    </div>
  );
}
