"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/gallery?q=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
      setQuery("");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left: logo + title */}
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="palette">
            🎨
          </span>
          <h1 className="text-xl font-bold text-terracotta">さとう家をみてね</h1>
        </div>

        {/* Right: search + settings */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="検索"
            onClick={() => setShowSearch(!showSearch)}
            className={`rounded-full p-2 transition-colors ${
              showSearch ? "bg-terracotta/10 text-terracotta" : "text-cocoa-light hover:bg-sand"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link
            href="/settings"
            aria-label="設定"
            className="rounded-full p-2 text-cocoa-light transition-colors hover:bg-sand"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <form onSubmit={handleSearch} className="px-4 pb-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="さくひんを けんさく..."
              autoFocus
              className="flex-1 px-4 py-2 bg-sand border border-cocoa-light/30 rounded-full text-sm text-cocoa placeholder:text-cocoa-light/60 focus:outline-none focus:ring-2 focus:ring-terracotta/50"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-terracotta text-white text-sm font-medium rounded-full hover:opacity-90 transition-opacity"
            >
              けんさく
            </button>
          </div>
        </form>
      )}
    </header>
  );
}
