export type Category = "drawing" | "craft" | "other";

export interface Child {
  id: string;
  name: string;
  birthday: Date;
  emoji: string;
  color: string;
}

export interface Artwork {
  id: string;
  childId: string;
  title: string;
  category: Category;
  imageUrl: string;
  thumbnailUrl: string;
  location: "幼稚園" | "おうち";
  date: Date;
  memo?: string;
  createdAt: Date;
}

export interface MonthGroup {
  year: number;
  month: number;
  artworks: Artwork[];
}

export type UserRole = "host" | "viewer";

export interface User {
  id: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}
