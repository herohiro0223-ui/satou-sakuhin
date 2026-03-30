"use client";

import { useData } from "@/contexts/DataContext";
import type { Artwork, Child } from "@/types";
import ArtworkCard from "./ArtworkCard";

interface ArtworkGridProps {
  artworks: Artwork[];
  children?: Child[];
}

export default function ArtworkGrid({ artworks }: ArtworkGridProps) {
  const { getChild } = useData();

  return (
    <div className="grid grid-cols-3 gap-2 px-4">
      {artworks.map((artwork) => {
        const child = getChild(artwork.childId);
        if (!child) return null;
        return (
          <ArtworkCard key={artwork.id} artwork={artwork} child={child} />
        );
      })}
    </div>
  );
}
