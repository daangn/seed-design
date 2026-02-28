const DEFAULT_BASE_URL = "https://seed-design.io";

const TRUSTED_PUBLIC_HOSTS = new Set(["seed-design.io", "www.seed-design.io"]);
const TRUSTED_LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

interface BaseUrlEnv {
  SEED_DOCS_BASE_URL?: string;
  NEXT_PUBLIC_SITE_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}

function resolveLocalOrigin(url: URL): string {
  const hasPort = Boolean(url.port);
  return `${url.protocol}//${url.hostname}${hasPort ? `:${url.port}` : ""}`;
}

function parseUrlCandidate(raw: string): URL | null {
  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

export function resolveTrustedBaseUrl(rawUrl: string): string {
  const parsed = parseUrlCandidate(rawUrl);
  if (!parsed) {
    return DEFAULT_BASE_URL;
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();

  if (TRUSTED_PUBLIC_HOSTS.has(hostname) && protocol === "https:") {
    return `https://${hostname}`;
  }

  if (TRUSTED_LOCAL_HOSTS.has(hostname) && (protocol === "http:" || protocol === "https:")) {
    return resolveLocalOrigin(parsed);
  }

  return DEFAULT_BASE_URL;
}

export function resolveTrustedBaseUrlFromEnv(env: BaseUrlEnv = process.env): string {
  const candidates = [
    env.SEED_DOCS_BASE_URL?.trim(),
    env.NEXT_PUBLIC_SITE_URL?.trim(),
    env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL.trim()}` : undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const trusted = resolveTrustedBaseUrl(candidate);
    if (trusted !== DEFAULT_BASE_URL) {
      return trusted;
    }
  }

  return DEFAULT_BASE_URL;
}
