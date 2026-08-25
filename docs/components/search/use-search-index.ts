"use client";

import { useEffect, useState } from "react";

/**
 * Fetch a static search index the first time someone actually searches — each one is a
 * separate blob next to fumadocs' own, and most page views never open the dialog.
 *
 * A failed fetch settles on an empty index: the section it feeds disappears and document
 * search carries on, which is the right way for an extra to fail.
 */
export function useSearchIndex<T>(api: string, active: boolean) {
  const [entries, setEntries] = useState<T[]>();

  useEffect(() => {
    if (!active || entries) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(api);
        if (!response.ok) throw new Error(`${api} responded ${response.status}`);

        const data: T[] = await response.json();
        if (!cancelled) setEntries(data);
      } catch {
        if (!cancelled) setEntries([]);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [api, active, entries]);

  return entries;
}
