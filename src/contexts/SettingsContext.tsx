"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import type { ViewerPermissions } from "@/types";

const SETTINGS_CACHE_KEY = "sakuhin_viewer_permissions";
const DB_KEY = "viewer_permissions";

const defaultPermissions: ViewerPermissions = { canAdd: false };

interface SettingsContextValue {
  viewerCanAdd: boolean;
  updateViewerCanAdd: (value: boolean) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function getCached(): ViewerPermissions {
  if (typeof window === "undefined") return defaultPermissions;
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY);
    return raw ? JSON.parse(raw) : defaultPermissions;
  } catch {
    return defaultPermissions;
  }
}

function setCache(perms: ViewerPermissions) {
  localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(perms));
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [viewerCanAdd, setViewerCanAdd] = useState(() => getCached().canAdd);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", DB_KEY)
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const perms = data[0].value as ViewerPermissions;
          setViewerCanAdd(perms.canAdd);
          setCache(perms);
        }
      } catch (err) {
        console.error("Failed to fetch viewer permissions:", err);
      }
    })();
  }, []);

  const updateViewerCanAdd = useCallback(async (value: boolean) => {
    const perms: ViewerPermissions = { canAdd: value };
    setViewerCanAdd(value);
    setCache(perms);

    const { error } = await supabase
      .from("app_settings")
      .upsert({ key: DB_KEY, value: perms });

    if (error) {
      console.error("Failed to update viewer permissions:", error);
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ viewerCanAdd, updateViewerCanAdd }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
