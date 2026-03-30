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

const USERS_KEY = "sakuhin_users";
const CURRENT_USER_KEY = "sakuhin_current_user";

interface AuthContextValue {
  user: User | null;
  users: User[];
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  updateUserRole: (userId: string, role: UserRole) => void;
  isHost: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsers = getStoredUsers();
    const storedUser = getStoredCurrentUser();
    setUsers(storedUsers);
    if (storedUser) {
      // Refresh from users list to get latest role
      const fresh = storedUsers.find((u) => u.id === storedUser.id);
      setUser(fresh ?? storedUser);
    }
    setLoading(false);
  }, []);

  const signup = useCallback(
    (email: string, password: string, displayName: string): string | null => {
      const currentUsers = getStoredUsers();
      if (currentUsers.some((u) => u.email === email)) {
        return "このメールアドレスは すでに つかわれています";
      }

      const isFirstUser = currentUsers.length === 0;
      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        password,
        displayName,
        role: isFirstUser ? "host" : "viewer",
        createdAt: new Date().toISOString(),
      };

      const updated = [...currentUsers, newUser];
      storeUsers(updated);
      storeCurrentUser(newUser);
      setUsers(updated);
      setUser(newUser);
      return null;
    },
    []
  );

  const login = useCallback(
    (email: string, password: string): string | null => {
      const currentUsers = getStoredUsers();
      const found = currentUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (!found) {
        return "メールアドレス または パスワードが ちがいます";
      }
      storeCurrentUser(found);
      setUser(found);
      setUsers(currentUsers);
      return null;
    },
    []
  );

  const logout = useCallback(() => {
    storeCurrentUser(null);
    setUser(null);
  }, []);

  const updateUserRole = useCallback(
    (userId: string, role: UserRole) => {
      const currentUsers = getStoredUsers();
      const updated = currentUsers.map((u) =>
        u.id === userId ? { ...u, role } : u
      );
      storeUsers(updated);
      setUsers(updated);
      // If updating self, refresh current user
      if (user && user.id === userId) {
        const refreshed = { ...user, role };
        storeCurrentUser(refreshed);
        setUser(refreshed);
      }
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
