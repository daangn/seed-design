import { useCallback, useState } from "react";
import type { FileEntry } from "@/types";

export function useFileTree() {
  const [entries, setEntries] = useState<Map<string, FileEntry[]>>(new Map());
  const [loading, setLoading] = useState<Set<string>>(new Set());

  const loadDir = useCallback(
    async (dir: string) => {
      if (entries.has(dir)) return;

      setLoading((prev) => new Set(prev).add(dir));
      try {
        const params = dir ? `?dir=${encodeURIComponent(dir)}` : "";
        const res = await fetch(`/api/files${params}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as FileEntry[];
        setEntries((prev) => new Map(prev).set(dir, data));
      } catch {
        setEntries((prev) => new Map(prev).set(dir, []));
      } finally {
        setLoading((prev) => {
          const next = new Set(prev);
          next.delete(dir);
          return next;
        });
      }
    },
    [entries],
  );

  const getEntries = useCallback(
    (dir: string): FileEntry[] | undefined => entries.get(dir),
    [entries],
  );

  const isLoading = useCallback((dir: string): boolean => loading.has(dir), [loading]);

  return { loadDir, getEntries, isLoading };
}
