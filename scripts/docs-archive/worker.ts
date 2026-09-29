const PREFIX = "/react/v2";

export function archiveOrigin(value: string): URL {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    !url.hostname.endsWith(".pages.dev") ||
    url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error("REACT_V2_ORIGIN must be a verified HTTPS Pages branch alias origin");
  }
  return url;
}

export async function handleArchiveRequest(
  request: Request,
  origin: string,
  fetcher: typeof fetch = fetch,
): Promise<Response> {
  const url = new URL(request.url);
  // The route's trailing wildcard also matches v20; leave those requests on the original Pages site.
  if (url.pathname !== PREFIX && !url.pathname.startsWith(`${PREFIX}/`)) return fetcher(request);
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  }
  if (url.pathname === PREFIX) {
    url.pathname += "/";
    return Response.redirect(url, 308);
  }

  let upstream: URL;
  try {
    upstream = new URL(url.pathname + url.search, archiveOrigin(origin));
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
        if (redirect.pathname !== PREFIX && !redirect.pathname.startsWith(`${PREFIX}/`)) {
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
    outputHeaders.set("x-seed-docs-version", "react/v2");
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
  fetch(request: Request, env: Env) {
    return handleArchiveRequest(request, env.REACT_V2_ORIGIN);
  },
};
