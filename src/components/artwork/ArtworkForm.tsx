"use client";

import { useState } from "react";
import type { Category } from "@/types";
import { children } from "@/data/mock";
import ImageUploader from "./ImageUploader";

const categories: { value: Category; label: string }[] = [
  { value: "drawing", label: "おえかき" },
  { value: "craft", label: "こうさく" },
  { value: "other", label: "そのほか" },
];

const locations = ["幼稚園", "おうち"] as const;

export default function ArtworkForm() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("drawing");
  const [location, setLocation] = useState<"幼稚園" | "おうち">("幼稚園");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // YYYY-MM-DD
  );
  const [memo, setMemo] = useState("");

  function handleImageSelect(file: File) {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = {
      imageFile: imageFile?.name ?? null,
      childId: selectedChildId,
      title,
      category,
      location,
      date,
      memo,
    };

    console.log("Form data:", formData);
    alert("プロトタイプのため保存できません");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 pb-8">
      {/* Image upload */}
      <ImageUploader
        imagePreview={imagePreview}
        onImageSelect={handleImageSelect}
      />

      {/* Child selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-cocoa">
          だれの さくひん？
        </label>
        <div className="flex gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedChildId === child.id
                  ? "text-white shadow-sm"
                  : "bg-sand text-cocoa hover:bg-sand/80"
              }`}
              style={
                selectedChildId === child.id
                  ? { backgroundColor: child.color }
                  : undefined
              }
            >
              <span>{child.emoji}</span>
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-cocoa">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="さくひんの なまえ"
          className="w-full rounded-xl bg-sand px-4 py-3 text-cocoa placeholder:text-cocoa-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      {/* Category selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-cocoa">
          カテゴリ
        </label>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                category === cat.value
                  ? "bg-terracotta text-white shadow-sm"
                  : "bg-sand text-cocoa hover:bg-sand/80"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-cocoa">
          ばしょ
        </label>
        <div className="flex gap-2">
          {locations.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                location === loc
                  ? "bg-sage text-white shadow-sm"
                  : "bg-sand text-cocoa hover:bg-sand/80"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-cocoa">
          ひにち
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl bg-sand px-4 py-3 text-cocoa focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      {/* Memo */}
      <div className="space-y-2">
        <label htmlFor="memo" className="block text-sm font-medium text-cocoa">
          メモ
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="おもいでを かいてね"
          rows={3}
          className="w-full resize-none rounded-xl bg-sand px-4 py-3 text-cocoa placeholder:text-cocoa-light/50 focus:outline-none focus:ring-2 focus:ring-terracotta/40"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full rounded-xl bg-terracotta py-3.5 text-base font-bold text-white shadow-sm transition-colors hover:bg-terracotta/90 active:bg-terracotta/80"
      >
        ほぞんする
      </button>
    </form>
  );
}
