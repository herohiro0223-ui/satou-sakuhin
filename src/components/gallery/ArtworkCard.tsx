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

      {/* Child emoji badge - bottom left */}
      <span className="absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-xs shadow-sm backdrop-blur-sm">
        {child.emoji}
      </span>

      {/* Category emoji badge - bottom right */}
      <span className="absolute bottom-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/80 text-xs shadow-sm backdrop-blur-sm">
        {getCategoryEmoji(artwork.category)}
      </span>
    </Link>
  );
}
