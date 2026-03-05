import { SEED_DOCS_BASE_URL } from "./constants.js";

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

interface DocsRuntimeConfig {
  getDocsBaseUrl: () => string;
  getDocsBaseOrigin: () => string;
  setDocsBaseUrl: (baseUrl?: string) => string;
}

function createDocsRuntimeConfig(initialBaseUrl: string): DocsRuntimeConfig {
  let docsBaseUrl = normalizeDocsBaseUrl(initialBaseUrl);
  let docsBaseUrlObject = new URL(docsBaseUrl);

  return {
    getDocsBaseUrl() {
      return docsBaseUrl;
    },
    getDocsBaseOrigin() {
      return docsBaseUrlObject.origin;
    },
    setDocsBaseUrl(baseUrl?: string) {
      docsBaseUrl = baseUrl
        ? normalizeDocsBaseUrl(baseUrl)
        : normalizeDocsBaseUrl(SEED_DOCS_BASE_URL);
      docsBaseUrlObject = new URL(docsBaseUrl);
      return docsBaseUrl;
    },
  };
}

const defaultConfig = createDocsRuntimeConfig(SEED_DOCS_BASE_URL);

export const getDocsBaseUrl = defaultConfig.getDocsBaseUrl;
export const getDocsBaseOrigin = defaultConfig.getDocsBaseOrigin;
export const setDocsBaseUrl = defaultConfig.setDocsBaseUrl;
export { createDocsRuntimeConfig };
