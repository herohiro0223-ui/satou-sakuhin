import Link from "next/link";
import { getCategoryEmoji } from "@/lib/utils";
import type { Artwork, Child } from "@/types";

interface ArtworkCardProps {
  artwork: Artwork;
  child: Child;
}

export default function ArtworkCard({ artwork, child }: ArtworkCardProps) {
  return (
    <Link
      href={`/artwork/${artwork.id}`}
      className="group relative block aspect-square overflow-hidden rounded-xl bg-sand/40"
    >
      <img
        src={artwork.thumbnailUrl}
        alt={artwork.title}
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
      />

      {/* Title bar - bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 pt-5 pb-1.5">
        <p className="text-[10px] font-medium text-white leading-tight truncate">
          {artwork.title}
        </p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px]">{child.emoji}</span>
          <span className="text-[9px] text-white/80">{child.name}</span>
        </div>
      </div>

      {/* Category emoji badge - top right */}
      <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-xs shadow-sm backdrop-blur-sm">
        {getCategoryEmoji(artwork.category)}
      </span>
    </Link>
  );
}
