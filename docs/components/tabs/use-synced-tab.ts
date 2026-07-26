"use client";

import { useCallback, useEffect, useState } from "react";

const SYNC_EVENT = "seed-tabs-sync";
// Separator for the effect-dep key. Null char, since tab values can contain spaces
// (e.g. "CLI로 추가").
const SEP = String.fromCharCode(0);

/**
 * Controlled tab value with optional cross-block sync. When `groupId` is set, the
 * selection is persisted to localStorage and broadcast to sibling tab groups with the
 * same id (mirrors Fumadocs' `groupId`/`persist` behavior, e.g. package managers).
 */
export function useSyncedTab(values: readonly string[], groupId?: string) {
  const [value, setValue] = useState(() => values[0] ?? "");
  const valuesKey = values.join(SEP);

  useEffect(() => {
    if (!groupId) return;
    const has = (candidate: string) => valuesKey.split(SEP).includes(candidate);

    const stored = window.localStorage.getItem(`${SYNC_EVENT}:${groupId}`);
    if (stored && has(stored)) setValue(stored);

    const onSync = (event: Event) => {
      const detail = (event as CustomEvent<{ groupId: string; value: string }>).detail;
      if (detail?.groupId === groupId && has(detail.value)) setValue(detail.value);
    };
    window.addEventListener(SYNC_EVENT, onSync);
    return () => window.removeEventListener(SYNC_EVENT, onSync);
  }, [groupId, valuesKey]);

  const onValueChange = useCallback(
    (next: string) => {
      setValue(next);
      if (!groupId) return;
      window.localStorage.setItem(`${SYNC_EVENT}:${groupId}`, next);
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { groupId, value: next } }));
    },
    [groupId],
  );

  return [value, onValueChange] as const;
}
