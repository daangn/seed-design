const DEFAULT_BASE_URL = "https://seed-design.io";

const TRUSTED_PUBLIC_HOSTS = new Set(["seed-design.io", "www.seed-design.io"]);
const TRUSTED_LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

function resolveLocalOrigin(url: URL): string {
  const hasPort = Boolean(url.port);
  return `${url.protocol}//${url.hostname}${hasPort ? `:${url.port}` : ""}`;
}

export function resolveTrustedBaseUrl(requestUrl: string): string {
  try {
    const parsed = new URL(requestUrl);
    const hostname = parsed.hostname.toLowerCase();
    const protocol = parsed.protocol.toLowerCase();

    if (TRUSTED_PUBLIC_HOSTS.has(hostname) && protocol === "https:") {
      return `https://${hostname}`;
    }

    if (TRUSTED_LOCAL_HOSTS.has(hostname) && (protocol === "http:" || protocol === "https:")) {
      return resolveLocalOrigin(parsed);
    }
  } catch {
    // ignore invalid request URL and fall back to default base URL
  }

  return DEFAULT_BASE_URL;
}
