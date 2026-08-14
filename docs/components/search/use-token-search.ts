"use client";

import { useEffect, useMemo, useState } from "react";
import { matchTokens, TOKEN_SEARCH_API, type TokenSearchEntry } from "@/lib/token-search";

const NO_MATCHES: TokenSearchEntry[] = [];

/**
 * Match design tokens against the search query, fetching the static token index the
 * first time someone actually searches — it is a second blob next to fumadocs' own, and
 * most page views never open the dialog.
 *
 * A failed fetch settles on an empty index: the token section disappears and document
 * search carries on, which is the right way for an extra to fail.
 */
export function useTokenSearch({ search, enabled }: { search: string; enabled: boolean }) {
  const [entries, setEntries] = useState<TokenSearchEntry[]>();

  const active = enabled && search.trim() !== "";

  useEffect(() => {
    if (!active || entries) return;

    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(TOKEN_SEARCH_API);
        if (!response.ok) throw new Error(`token index responded ${response.status}`);

        const data: TokenSearchEntry[] = await response.json();
        if (!cancelled) setEntries(data);
      } catch {
        if (!cancelled) setEntries([]);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [active, entries]);

  return useMemo(
    () => (active && entries ? matchTokens(entries, search) : NO_MATCHES),
    [active, entries, search],
  );
}
