"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getCategoryLabel, getCategoryEmoji } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ArtworkDetailPage() {
  return (
    <AuthGuard>
      <ArtworkDetailContent />
    </AuthGuard>
  );
}

function ArtworkDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isHost } = useAuth();
  const { getArtwork, getChild, deleteArtwork } = useData();

  const artwork = getArtwork(id);
  const child = artwork ? getChild(artwork.childId) : null;

  if (!artwork || !child) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <p className="text-cocoa text-lg">さくひんが みつかりません</p>
      </div>
    );
  }

  const artworkDate = new Date(artwork.date);
  const formattedDate = `${artworkDate.getFullYear()}年${artworkDate.getMonth() + 1}月${artworkDate.getDate()}日`;

  const categoryColors: Record<string, string> = {
    drawing: "bg-sky text-white",
    craft: "bg-terracotta text-white",
    other: "bg-sage text-white",
  };

  const handleEdit = () => {
    router.push(`/artwork/${id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("この さくひんを さくじょしますか？")) {
      deleteArtwork(id);
      router.push("/gallery");
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Back button */}
      <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-sm">
        <div className="px-4 py-3">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 text-cocoa hover:text-terracotta transition-colors"
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
            <span className="text-sm font-medium">もどる</span>
          </Link>
        </div>
      </div>

      <main className="px-4 pb-8">
        {/* Large image */}
        <div className="mb-4">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full aspect-square object-cover rounded-2xl shadow-md"
          />
        </div>

        {/* Info card */}
        <div className="bg-sand rounded-2xl p-5 shadow-sm mb-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-cocoa mb-3">
            {artwork.title}
          </h1>

          {/* Child name + emoji */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{child.emoji}</span>
            <span className="text-lg text-cocoa font-medium">{child.name}</span>
          </div>

          {/* Category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[artwork.category]}`}
            >
              <span>{getCategoryEmoji(artwork.category)}</span>
              <span>{getCategoryLabel(artwork.category)}</span>
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 mb-3 text-cocoa">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-sm">{artwork.location}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 mb-3 text-cocoa">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span className="text-sm">{formattedDate}</span>
          </div>

          {/* Memo */}
          {artwork.memo && (
            <div className="mt-4 pt-4 border-t border-cocoa-light/30">
              <p className="text-sm text-cocoa leading-relaxed">
                {artwork.memo}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons - host only */}
        {isHost && (
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex-1 py-3 bg-sage text-white rounded-full font-medium text-center hover:opacity-90 transition-opacity"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-3 bg-coral text-white rounded-full font-medium text-center hover:opacity-90 transition-opacity"
            >
              削除
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
