"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { User, UserRole } from "@/types";
import { generateId } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const CURRENT_USER_KEY = "sakuhin_current_user";

interface AuthContextValue {
  user: User | null;
  users: User[];
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<string | null>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  isHost: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeCurrentUser(user: User | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

function rowToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    password: row.password as string,
    displayName: row.display_name as string,
    role: row.role as UserRole,
    createdAt: row.created_at as string,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // まずローカルキャッシュでログイン状態を復元
    const cached = getStoredCurrentUser();
    if (cached) setUser(cached);

    // Supabase からユーザー一覧を取得
    (async () => {
      try {
        const { data, error } = await supabase.from("users").select("*");
        if (error) throw error;
        const fetched = (data || []).map(rowToUser);
        setUsers(fetched);

        // キャッシュユーザーが DB に存在するか確認
        if (cached) {
          const fresh = fetched.find((u) => u.id === cached.id);
          if (fresh) {
            setUser(fresh);
            storeCurrentUser(fresh);
          } else {
            // DB に存在しない → ログアウト
            setUser(null);
            storeCurrentUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signup = useCallback(
    async (email: string, password: string, displayName: string): Promise<string | null> => {
      // 重複チェック
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .limit(1);

      if (existing && existing.length > 0) {
        return "このメールアドレスは すでに つかわれています";
      }

      // 最初のユーザーかどうか
      const { count } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      const isFirstUser = (count ?? 0) === 0;

      const newUser: User = {
        id: generateId(),
        email,
        password,
        displayName,
        role: isFirstUser ? "host" : "viewer",
        createdAt: new Date().toISOString(),
      };

      const { error } = await supabase.from("users").insert({
        id: newUser.id,
        email: newUser.email,
        password: newUser.password,
        display_name: newUser.displayName,
        role: newUser.role,
        created_at: newUser.createdAt,
      });

      if (error) {
        console.error("signup failed:", error);
        return "とうろくに しっぱいしました";
      }

      storeCurrentUser(newUser);
      setUser(newUser);
      setUsers((prev) => [...prev, newUser]);
      return null;
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .limit(1);

      if (error || !data || data.length === 0) {
        return "メールアドレス または パスワードが ちがいます";
      }

      const found = rowToUser(data[0]);
      storeCurrentUser(found);
      setUser(found);
      return null;
    },
    []
  );

  const logout = useCallback(() => {
    storeCurrentUser(null);
    setUser(null);
  }, []);

  const updateUserRole = useCallback(
    async (userId: string, role: UserRole) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );

      if (user && user.id === userId) {
        const refreshed = { ...user, role };
        storeCurrentUser(refreshed);
        setUser(refreshed);
      }

      await supabase.from("users").update({ role }).eq("id", userId);
    },
    [user]
  );

  const isHost = user?.role === "host";

  return (
    <AuthContext.Provider
      value={{ user, users, loading, signup, login, logout, updateUserRole, isHost }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
