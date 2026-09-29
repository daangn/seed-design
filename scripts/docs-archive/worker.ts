import archives from "./archives.json";
import { type ArchiveDefinition, archiveOrigin, archivePrefix, isArchivePath } from "./config";

export async function handleArchiveRequest(
  request: Request,
  definitions: readonly ArchiveDefinition[],
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  // Cloudflare route wildcards also match v20 or v2-other. Match complete path segments here.
  const archive = definitions.find((entry) => isArchivePath(url.pathname, archivePrefix(entry)));
  if (!archive) return fetcher(request);
  const prefix = archivePrefix(archive);
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  if (url.pathname === prefix) {
    url.pathname += "/";
    return Response.redirect(url, 308);
  }

  let upstream: URL;
  try {
    upstream = new URL(url.pathname + url.search, archiveOrigin(archive.origin));
  } catch {
    return new Response("Archive origin is not configured", { status: 503 });
  }
  const headers = new Headers();
  for (const name of [
    "accept",
    "accept-encoding",
    "if-none-match",
    "if-modified-since",
    "range",
    "if-range",
  ]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const response = await fetcher(
      new Request(upstream, { method: request.method, headers, redirect: "manual" }),
    );
    const outputHeaders = new Headers(response.headers);
    const location = outputHeaders.get("location");
    if (location) {
      const redirect = new URL(location, upstream);
      if (redirect.origin === upstream.origin) {
        if (!isArchivePath(redirect.pathname, prefix)) {
          await response.body?.cancel();
          return new Response("Invalid archive redirect", { status: 502 });
        }
        redirect.host = url.host;
        redirect.protocol = url.protocol;
        outputHeaders.set("location", redirect.href);
      }
    }
    // Pages previews remain noindex; the public archive has its own canonical paths.
    if (url.hostname === "seed-design.io") outputHeaders.delete("x-robots-tag");
    else outputHeaders.set("x-robots-tag", "noindex");
    outputHeaders.delete("set-cookie");
    outputHeaders.set("x-seed-docs-version", `${archive.platform}/${archive.version}`);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: outputHeaders,
    });
  } catch {
    console.error(JSON.stringify({ event: "docs_archive_fetch_failed", path: url.pathname }));
    return new Response("Archive temporarily unavailable", { status: 502 });
  }
}

export default {
  fetch(request: Request) {
    return handleArchiveRequest(request, archives);
  },
};
