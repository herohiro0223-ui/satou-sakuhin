"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Artwork, Child } from "@/types";
import { generateId } from "@/lib/utils";
import { supabase, deleteImage } from "@/lib/supabase";
import {
  children as seedChildren,
  artworks as seedArtworks,
} from "@/data/mock";

const CHILDREN_KEY = "sakuhin_children";
const ARTWORKS_KEY = "sakuhin_artworks";

interface DataContextValue {
  children: Child[];
  artworks: Artwork[];
  loading: boolean;
  addArtwork: (artwork: Omit<Artwork, "id" | "createdAt">) => Promise<Artwork>;
  updateArtwork: (id: string, data: Partial<Omit<Artwork, "id" | "createdAt">>) => Promise<void>;
  deleteArtwork: (id: string) => Promise<void>;
  getArtwork: (id: string) => Artwork | undefined;
  getChild: (id: string) => Child | undefined;
  addChild: (child: Omit<Child, "id">) => Promise<Child>;
  updateChild: (id: string, data: Partial<Omit<Child, "id">>) => Promise<void>;
  deleteChild: (id: string) => Promise<void>;
  exportData: () => string;
  importData: (json: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

// --- DB row <-> TypeScript type mappers ---

function rowToChild(row: Record<string, unknown>): Child {
  return {
    id: row.id as string,
    name: row.name as string,
    birthday: new Date(row.birthday as string),
    emoji: row.emoji as string,
    color: row.color as string,
  };
}

function childToRow(c: Child) {
  return {
    id: c.id,
    name: c.name,
    birthday: new Date(c.birthday).toISOString(),
    emoji: c.emoji,
    color: c.color,
  };
}

function rowToArtwork(row: Record<string, unknown>): Artwork {
  return {
    id: row.id as string,
    childId: row.child_id as string,
    title: row.title as string,
    category: row.category as Artwork["category"],
    imageUrl: row.image_url as string,
    thumbnailUrl: row.thumbnail_url as string,
    location: row.location as Artwork["location"],
    date: new Date(row.date as string),
    memo: (row.memo as string) || undefined,
    createdAt: new Date(row.created_at as string),
  };
}

function artworkToRow(a: Artwork) {
  return {
    id: a.id,
    child_id: a.childId,
    title: a.title,
    category: a.category,
    image_url: a.imageUrl,
    thumbnail_url: a.thumbnailUrl,
    location: a.location,
    date: new Date(a.date).toISOString(),
    memo: a.memo || null,
    created_at: new Date(a.createdAt).toISOString(),
  };
}

// --- localStorage cache helpers ---

function cacheChildren(children: Child[]) {
  try {
    localStorage.setItem(
      CHILDREN_KEY,
      JSON.stringify(
        children.map((c) => ({
          ...c,
          birthday: new Date(c.birthday).toISOString(),
        }))
      )
    );
  } catch {}
}

function cacheArtworks(artworks: Artwork[]) {
  try {
    localStorage.setItem(
      ARTWORKS_KEY,
      JSON.stringify(
        artworks.map((a) => ({
          ...a,
          date: new Date(a.date).toISOString(),
          createdAt: new Date(a.createdAt).toISOString(),
        }))
      )
    );
  } catch {}
}

function getCachedChildren(): Child[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    if (!raw) return null;
    return JSON.parse(raw).map((c: Record<string, unknown>) => ({
      ...c,
      birthday: new Date(c.birthday as string),
    }));
  } catch {
    return null;
  }
}

function getCachedArtworks(): Artwork[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ARTWORKS_KEY);
    if (!raw) return null;
    return JSON.parse(raw).map((a: Record<string, unknown>) => ({
      ...a,
      date: new Date(a.date as string),
      createdAt: new Date(a.createdAt as string),
    }));
  } catch {
    return null;
  }
}

// --- Provider ---

export function DataProvider({ children: childrenNode }: { children: ReactNode }) {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [artworksData, setArtworksData] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  // 起動時: キャッシュ → Supabase fetch → seed if empty
  useEffect(() => {
    const cached = getCachedChildren();
    const cachedArt = getCachedArtworks();
    if (cached) setChildrenData(cached);
    if (cachedArt) setArtworksData(cachedArt);

    (async () => {
      try {
        // Children
        const { data: childRows, error: childErr } = await supabase
          .from("children")
          .select("*");
        if (childErr) throw childErr;

        let childrenResult: Child[];
        if (!childRows || childRows.length === 0) {
          const seedRows = seedChildren.map(childToRow);
          const { error: seedErr } = await supabase
            .from("children")
            .upsert(seedRows);
          if (seedErr) throw seedErr;
          childrenResult = seedChildren;
        } else {
          childrenResult = childRows.map(rowToChild);
        }

        // Artworks
        const { data: artRows, error: artErr } = await supabase
          .from("artworks")
          .select("*")
          .order("created_at", { ascending: false });
        if (artErr) throw artErr;

        let artworksResult: Artwork[];
        if (!artRows || artRows.length === 0) {
          const seedRows = seedArtworks.map((a) => artworkToRow(a));
          const { error: seedErr } = await supabase
            .from("artworks")
            .upsert(seedRows);
          if (seedErr) throw seedErr;
          artworksResult = seedArtworks;
        } else {
          artworksResult = artRows.map(rowToArtwork);
        }

        setChildrenData(childrenResult);
        setArtworksData(artworksResult);
        cacheChildren(childrenResult);
        cacheArtworks(artworksResult);
      } catch (err) {
        console.error("Supabase fetch failed, using cache:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- Artwork CRUD ---

  const addArtwork = useCallback(
    async (artwork: Omit<Artwork, "id" | "createdAt">): Promise<Artwork> => {
      const newArtwork: Artwork = {
        ...artwork,
        id: generateId(),
        createdAt: new Date(),
      };

      // Optimistic update
      setArtworksData((prev) => {
        const updated = [newArtwork, ...prev];
        cacheArtworks(updated);
        return updated;
      });

      // Supabase sync
      const { error } = await supabase
        .from("artworks")
        .insert(artworkToRow(newArtwork));
      if (error) {
        console.error("addArtwork sync failed:", error);
        throw error;
      }

      return newArtwork;
    },
    []
  );

  const updateArtwork = useCallback(
    async (id: string, data: Partial<Omit<Artwork, "id" | "createdAt">>) => {
      // Optimistic update
      setArtworksData((prev) => {
        const updated = prev.map((a) => (a.id === id ? { ...a, ...data } : a));
        cacheArtworks(updated);
        return updated;
      });

      // Build DB update payload (camelCase → snake_case)
      const dbData: Record<string, unknown> = {};
      if (data.childId !== undefined) dbData.child_id = data.childId;
      if (data.title !== undefined) dbData.title = data.title;
      if (data.category !== undefined) dbData.category = data.category;
      if (data.imageUrl !== undefined) dbData.image_url = data.imageUrl;
      if (data.thumbnailUrl !== undefined) dbData.thumbnail_url = data.thumbnailUrl;
      if (data.location !== undefined) dbData.location = data.location;
      if (data.date !== undefined) dbData.date = new Date(data.date).toISOString();
      if (data.memo !== undefined) dbData.memo = data.memo || null;

      const { error } = await supabase
        .from("artworks")
        .update(dbData)
        .eq("id", id);
      if (error) {
        console.error("updateArtwork sync failed:", error);
        throw error;
      }
    },
    []
  );

  const deleteArtwork = useCallback(async (id: string) => {
    // Get artwork for image cleanup before removing from state
    let artworkToDelete: Artwork | undefined;
    setArtworksData((prev) => {
      artworkToDelete = prev.find((a) => a.id === id);
      const updated = prev.filter((a) => a.id !== id);
      cacheArtworks(updated);
      return updated;
    });

    // Supabase sync
    try {
      const { error } = await supabase
        .from("artworks")
        .delete()
        .eq("id", id);
      if (error) console.error("deleteArtwork sync failed:", error);

      // Storage cleanup
      if (artworkToDelete) {
        await deleteImage(artworkToDelete.imageUrl);
        if (artworkToDelete.thumbnailUrl !== artworkToDelete.imageUrl) {
          await deleteImage(artworkToDelete.thumbnailUrl);
        }
      }
    } catch (err) {
      console.error("deleteArtwork cleanup failed:", err);
    }
  }, []);

  const getArtwork = useCallback(
    (id: string) => artworksData.find((a) => a.id === id),
    [artworksData]
  );

  // --- Child CRUD ---

  const getChild = useCallback(
    (id: string) => childrenData.find((c) => c.id === id),
    [childrenData]
  );

  const addChild = useCallback(
    async (child: Omit<Child, "id">): Promise<Child> => {
      const newChild: Child = {
        ...child,
        id: generateId(),
      };

      setChildrenData((prev) => {
        const updated = [...prev, newChild];
        cacheChildren(updated);
        return updated;
      });

      try {
        const { error } = await supabase
          .from("children")
          .insert(childToRow(newChild));
        if (error) console.error("addChild sync failed:", error);
      } catch (err) {
        console.error("addChild sync failed:", err);
      }

      return newChild;
    },
    []
  );

  const updateChild = useCallback(
    async (id: string, data: Partial<Omit<Child, "id">>) => {
      setChildrenData((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
        cacheChildren(updated);
        return updated;
      });

      const dbData: Record<string, unknown> = {};
      if (data.name !== undefined) dbData.name = data.name;
      if (data.birthday !== undefined)
        dbData.birthday = new Date(data.birthday).toISOString();
      if (data.emoji !== undefined) dbData.emoji = data.emoji;
      if (data.color !== undefined) dbData.color = data.color;

      try {
        const { error } = await supabase
          .from("children")
          .update(dbData)
          .eq("id", id);
        if (error) console.error("updateChild sync failed:", error);
      } catch (err) {
        console.error("updateChild sync failed:", err);
      }
    },
    []
  );

  const deleteChild = useCallback(async (id: string) => {
    setChildrenData((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      cacheChildren(updated);
      return updated;
    });

    try {
      const { error } = await supabase
        .from("children")
        .delete()
        .eq("id", id);
      if (error) console.error("deleteChild sync failed:", error);
    } catch (err) {
      console.error("deleteChild sync failed:", err);
    }
  }, []);

  // --- Export / Import ---

  const exportData = useCallback(() => {
    return JSON.stringify({
      version: 1,
      children: childrenData.map((c) => ({
        ...c,
        birthday: new Date(c.birthday).toISOString(),
      })),
      artworks: artworksData.map((a) => ({
        ...a,
        date: new Date(a.date).toISOString(),
        createdAt: new Date(a.createdAt).toISOString(),
      })),
    });
  }, [childrenData, artworksData]);

  const importData = useCallback(async (json: string) => {
    const data = JSON.parse(json);
    if (!data.children || !data.artworks) {
      throw new Error("Invalid backup format");
    }

    const importedChildren: Child[] = data.children.map(
      (c: Record<string, unknown>) => ({
        ...c,
        birthday: new Date(c.birthday as string),
      })
    );
    const importedArtworks: Artwork[] = data.artworks.map(
      (a: Record<string, unknown>) => ({
        ...a,
        date: new Date(a.date as string),
        createdAt: new Date(a.createdAt as string),
      })
    );

    // Update local state + cache
    cacheChildren(importedChildren);
    cacheArtworks(importedArtworks);
    setChildrenData(importedChildren);
    setArtworksData(importedArtworks);

    // Sync to Supabase: upsert all rows
    try {
      const { error: childErr } = await supabase
        .from("children")
        .upsert(importedChildren.map(childToRow));
      if (childErr) console.error("importData children sync failed:", childErr);

      const { error: artErr } = await supabase
        .from("artworks")
        .upsert(importedArtworks.map(artworkToRow));
      if (artErr) console.error("importData artworks sync failed:", artErr);
    } catch (err) {
      console.error("importData sync failed:", err);
    }
  }, []);

  return (
    <DataContext.Provider
      value={{
        children: childrenData,
        artworks: artworksData,
        loading,
        addArtwork,
        updateArtwork,
        deleteArtwork,
        getArtwork,
        getChild,
        addChild,
        updateChild,
        deleteChild,
        exportData,
        importData,
      }}
    >
      {childrenNode}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
