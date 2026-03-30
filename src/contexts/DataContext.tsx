"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Artwork, Child, Category } from "@/types";
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
  addArtwork: (artwork: Omit<Artwork, "id" | "createdAt">) => Artwork;
  updateArtwork: (id: string, data: Partial<Omit<Artwork, "id" | "createdAt">>) => void;
  deleteArtwork: (id: string) => void;
  getArtwork: (id: string) => Artwork | undefined;
  getChild: (id: string) => Child | undefined;
  addChild: (child: Omit<Child, "id">) => Child;
  updateChild: (id: string, data: Partial<Omit<Child, "id">>) => void;
  deleteChild: (id: string) => void;
  exportData: () => string;
  importData: (json: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// Serialize dates to JSON-safe format
function serializeArtworks(artworks: Artwork[]): string {
  return JSON.stringify(
    artworks.map((a) => ({
      ...a,
      date: new Date(a.date).toISOString(),
      createdAt: new Date(a.createdAt).toISOString(),
    }))
  );
}

function deserializeArtworks(raw: string): Artwork[] {
  const parsed = JSON.parse(raw);
  return parsed.map((a: Record<string, unknown>) => ({
    ...a,
    date: new Date(a.date as string),
    createdAt: new Date(a.createdAt as string),
  }));
}

function serializeChildren(children: Child[]): string {
  return JSON.stringify(
    children.map((c) => ({
      ...c,
      birthday: new Date(c.birthday).toISOString(),
    }))
  );
}

function deserializeChildren(raw: string): Child[] {
  const parsed = JSON.parse(raw);
  return parsed.map((c: Record<string, unknown>) => ({
    ...c,
    birthday: new Date(c.birthday as string),
  }));
}

function getStoredChildren(): Child[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CHILDREN_KEY);
    return raw ? deserializeChildren(raw) : null;
  } catch {
    return null;
  }
}

function storeChildren(children: Child[]) {
  localStorage.setItem(CHILDREN_KEY, serializeChildren(children));
}

function getStoredArtworks(): Artwork[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ARTWORKS_KEY);
    return raw ? deserializeArtworks(raw) : null;
  } catch {
    return null;
  }
}

function storeArtworks(artworks: Artwork[]) {
  localStorage.setItem(ARTWORKS_KEY, serializeArtworks(artworks));
}

export function DataProvider({ children: childrenNode }: { children: ReactNode }) {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [artworksData, setArtworksData] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedChildren = getStoredChildren();
    const storedArtworks = getStoredArtworks();

    if (storedChildren) {
      setChildrenData(storedChildren);
    } else {
      // Seed with mock data
      storeChildren(seedChildren);
      setChildrenData(seedChildren);
    }

    if (storedArtworks) {
      setArtworksData(storedArtworks);
    } else {
      storeArtworks(seedArtworks);
      setArtworksData(seedArtworks);
    }

    setLoading(false);
  }, []);

  const addArtwork = useCallback(
    (artwork: Omit<Artwork, "id" | "createdAt">): Artwork => {
      const newArtwork: Artwork = {
        ...artwork,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
      const updated = [newArtwork, ...artworksData];
      storeArtworks(updated);
      setArtworksData(updated);
      return newArtwork;
    },
    [artworksData]
  );

  const updateArtwork = useCallback(
    (id: string, data: Partial<Omit<Artwork, "id" | "createdAt">>) => {
      const updated = artworksData.map((a) =>
        a.id === id ? { ...a, ...data } : a
      );
      storeArtworks(updated);
      setArtworksData(updated);
    },
    [artworksData]
  );

  const deleteArtwork = useCallback(
    (id: string) => {
      const updated = artworksData.filter((a) => a.id !== id);
      storeArtworks(updated);
      setArtworksData(updated);
    },
    [artworksData]
  );

  const getArtwork = useCallback(
    (id: string) => artworksData.find((a) => a.id === id),
    [artworksData]
  );

  const getChild = useCallback(
    (id: string) => childrenData.find((c) => c.id === id),
    [childrenData]
  );

  const addChild = useCallback(
    (child: Omit<Child, "id">): Child => {
      const newChild: Child = {
        ...child,
        id: crypto.randomUUID(),
      };
      const updated = [...childrenData, newChild];
      storeChildren(updated);
      setChildrenData(updated);
      return newChild;
    },
    [childrenData]
  );

  const updateChild = useCallback(
    (id: string, data: Partial<Omit<Child, "id">>) => {
      const updated = childrenData.map((c) =>
        c.id === id ? { ...c, ...data } : c
      );
      storeChildren(updated);
      setChildrenData(updated);
    },
    [childrenData]
  );

  const deleteChild = useCallback(
    (id: string) => {
      const updated = childrenData.filter((c) => c.id !== id);
      storeChildren(updated);
      setChildrenData(updated);
    },
    [childrenData]
  );

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

  const importData = useCallback((json: string) => {
    const data = JSON.parse(json);
    if (!data.children || !data.artworks) {
      throw new Error("Invalid backup format");
    }
    const importedChildren: Child[] = data.children.map((c: Record<string, unknown>) => ({
      ...c,
      birthday: new Date(c.birthday as string),
    }));
    const importedArtworks: Artwork[] = data.artworks.map((a: Record<string, unknown>) => ({
      ...a,
      date: new Date(a.date as string),
      createdAt: new Date(a.createdAt as string),
    }));
    storeChildren(importedChildren);
    storeArtworks(importedArtworks);
    setChildrenData(importedChildren);
    setArtworksData(importedArtworks);
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
