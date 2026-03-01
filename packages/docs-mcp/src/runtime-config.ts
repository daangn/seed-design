import { SEED_DOCS_BASE_URL } from "./constants.js";

let docsBaseUrl = normalizeDocsBaseUrl(SEED_DOCS_BASE_URL);
let docsBaseUrlObject = new URL(docsBaseUrl);

export function normalizeDocsBaseUrl(rawBaseUrl: string): string {
  const normalized = rawBaseUrl.trim();
  if (!normalized) {
    throw new Error("baseUrl must not be empty");
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error(`Invalid baseUrl: ${rawBaseUrl}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`baseUrl must use http or https: ${rawBaseUrl}`);
  }

  if (parsed.search || parsed.hash) {
    throw new Error(`baseUrl must not include query or hash: ${rawBaseUrl}`);
  }

  const pathname = parsed.pathname.replace(/\/+$/, "");
  return `${parsed.origin}${pathname}` || parsed.origin;
}

export function setDocsBaseUrl(baseUrl?: string): string {
  docsBaseUrl = baseUrl ? normalizeDocsBaseUrl(baseUrl) : normalizeDocsBaseUrl(SEED_DOCS_BASE_URL);
  docsBaseUrlObject = new URL(docsBaseUrl);
  return docsBaseUrl;
}

export function getDocsBaseUrl(): string {
  return docsBaseUrl;
}

export function getDocsBaseOrigin(): string {
  return docsBaseUrlObject.origin;
}

