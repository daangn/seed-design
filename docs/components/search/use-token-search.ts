"use client";

import { useMemo } from "react";
import { matchTokens, TOKEN_SEARCH_API, type TokenSearchEntry } from "@/lib/token-search";
import { useSearchIndex } from "./use-search-index";

const NO_MATCHES: TokenSearchEntry[] = [];

/** Design tokens matching the search query. `pending` is the index still being fetched — see
 * `useComponentSearch` for why the card waits on it. */
export function useTokenSearch({ search, enabled }: { search: string; enabled: boolean }) {
  const active = enabled && search.trim() !== "";
  const entries = useSearchIndex<TokenSearchEntry>(TOKEN_SEARCH_API, active);

  const matches = useMemo(
    () => (active && entries ? matchTokens(entries, search) : NO_MATCHES),
    [active, entries, search],
  );

  return { matches, pending: active && !entries };
}
