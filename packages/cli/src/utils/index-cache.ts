import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import envPaths from "env-paths";
import { CliError } from "@/src/utils/error";

/**
 * A disk cache for the one large thing this CLI downloads: the documentation search index,
 * around 21MB before compression and republished whenever the docs or any component package
 * ships.
 *
 * The server answers `cache-control: public, max-age=0, must-revalidate`, so every run
 * revalidates and only pays for the body when the index actually changed. It also answers 304
 * without repeating the ETag, which is why the tag is kept here rather than read back off the
 * response: a cache that trusted the 304 to carry it would throw its entry away every time.
 *
 * One URL, one pair of files, overwritten in place. Nothing accumulates, so nothing has to be
 * evicted.
 */

/**
 * `env-paths` rejects a scoped name outright and appends `-nodejs` unless the suffix is
 * cleared, so the name here is flat and the suffix empty on purpose.
 *
 * `SEED_CACHE_DIR` moves the whole thing, which is what keeps a test run out of the real
 * user's cache and gives CI somewhere disposable to put it.
 */
const CACHE_DIR = path.join(
  process.env.SEED_CACHE_DIR ?? envPaths("seed-design", { suffix: "" }).cache,
  "docs-search",
);

/** Large enough for a 21MB body on a slow connection; a stalled request still gives up. */
const DOWNLOAD_TIMEOUT_MS = 60_000;

interface CacheEntry {
  body: string;
  etag?: string;
}

const keyFor = (url: string) => createHash("sha256").update(url).digest("hex").slice(0, 16);

async function readCache(key: string): Promise<CacheEntry | undefined> {
  const body = await readFile(path.join(CACHE_DIR, `${key}.json`), "utf8").catch(() => undefined);
  if (body === undefined) return undefined;

  const etag = await readFile(path.join(CACHE_DIR, `${key}.etag`), "utf8").catch(() => undefined);
  return { body, ...(etag && { etag }) };
}

/**
 * Written to a unique temporary name and renamed into place, so a reader in another process
 * sees either the whole old file or the whole new one. A half-written 21MB index parses as a
 * syntax error at best and as a wrong answer at worst.
 */
async function writeCache(key: string, { body, etag }: CacheEntry) {
  await mkdir(CACHE_DIR, { recursive: true });

  const target = path.join(CACHE_DIR, `${key}.json`);
  const temporary = `${target}.${randomUUID()}`;

  try {
    await writeFile(temporary, body, "utf8");
    await rename(temporary, target);
  } catch {
    await unlink(temporary).catch(() => {});
    return;
  }

  if (etag) await writeFile(path.join(CACHE_DIR, `${key}.etag`), etag, "utf8").catch(() => {});
}

/**
 * The body at `url`, from cache when the server says it has not changed.
 *
 * A failed request falls back to whatever is cached rather than failing outright — the index
 * changes rarely, so yesterday's copy answers the same question as today's, and a search that
 * works offline is worth more than one that insists on being current.
 */
export async function fetchCached(url: string): Promise<string> {
  const key = keyFor(url);
  const cached = await readCache(key);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DOWNLOAD_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      ...(cached?.etag && { headers: { "if-none-match": cached.etag } }),
    });

    if (response.status === 304 && cached) return cached.body;

    if (!response.ok) {
      if (cached) return cached.body;

      throw new CliError({
        message: `검색 인덱스를 가져오지 못했어요: ${response.status} ${response.statusText}`,
        hint: `${url} 에 접근할 수 있는지 확인해주세요.`,
      });
    }

    const body = await response.text();
    const etag = response.headers.get("etag");
    await writeCache(key, { body, ...(etag && { etag }) });

    return body;
  } catch (error) {
    if (error instanceof CliError) throw error;
    if (cached) return cached.body;

    throw new CliError({
      message: `검색 인덱스를 가져오지 못했어요: ${url}`,
      hint: "네트워크 상태를 확인하고 다시 시도해주세요.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
