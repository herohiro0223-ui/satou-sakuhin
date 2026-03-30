"use client";

import { useRef } from "react";

interface ImageUploaderProps {
  imagePreview: string | null;
  onImageSelect: (file: File) => void;
}

export default function ImageUploader({
  imagePreview,
  onImageSelect,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleClick}
        className={`relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
          imagePreview
            ? "border-transparent"
            : "border-cocoa-light/40 bg-sand hover:border-terracotta/50 hover:bg-sand/80"
        }`}
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="プレビュー"
            className="h-full w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3">
            {/* Camera icon */}
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
              className="text-cocoa-light"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span className="text-sm font-medium text-cocoa-light">
              しゃしんを えらぶ
            </span>
          </div>
        )}
      </button>
    </div>
  );
}
