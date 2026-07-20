"use client";

import { useEffect, useState } from "react";
import { sectionLabel } from "@/lib/docs-sections";

export interface RecentPage {
  url: string;
  title: string;
  section: string;
  ts: number;
}

const STORAGE_KEY = "seed-docs-recent";
const CHANGE_EVENT = "seed-docs-recent-change";
const MAX_ITEMS = 6;

const INTERNAL_ORIGIN = "https://seed-docs.local";

function isInternalUrl(value: unknown): value is string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return false;
  }

  try {
    return new URL(value, INTERNAL_ORIGIN).origin === INTERNAL_ORIGIN;
  } catch {
    return false;
  }
}

export function parseRecentPages(raw: string | null): RecentPage[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) return [];

  const pages: RecentPage[] = [];

  for (const value of parsed) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) continue;

    const entry = value as Record<string, unknown>;
    const title = typeof entry.title === "string" ? entry.title.trim() : "";

    if (
      !isInternalUrl(entry.url) ||
      !title ||
      typeof entry.ts !== "number" ||
      !Number.isFinite(entry.ts)
    ) {
      continue;
    }

    pages.push({
      url: entry.url,
      title,
      section: sectionLabel(entry.url),
      ts: entry.ts,
    });

    if (pages.length === MAX_ITEMS) break;
  }

  return pages;
}

function readRecentPages(): RecentPage[] {
  try {
    return parseRecentPages(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

/**
 * Record a visit. No-op on the landing route ("/"). Call from a client effect on
 * navigation. Dedupes by url, keeps most-recent-first, caps at MAX_ITEMS.
 */
export function recordRecentPage(pathname: string, query = ""): void {
  if (!pathname || pathname === "/" || typeof window === "undefined") return;

  const url = query ? `${pathname}?${query}` : pathname;

  const rawTitle = typeof document !== "undefined" ? document.title : "";
  const title = rawTitle.replace(/ \| SEED Design$/, "").trim() || url;

  const entry: RecentPage = {
    url,
    title,
    section: sectionLabel(url),
    ts: Date.now(),
  };

  const next = [entry, ...readRecentPages().filter((page) => page.url !== url)].slice(0, MAX_ITEMS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // ignore storage quota / availability errors
  }
}

/** Reactive recent-pages list, kept fresh via the local change event + cross-tab storage. */
export function useRecentPages(): RecentPage[] {
  const [pages, setPages] = useState<RecentPage[]>([]);

  useEffect(() => {
    const sync = () => setPages(readRecentPages());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return pages;
}
