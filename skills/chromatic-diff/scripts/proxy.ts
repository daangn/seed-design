/**
 * Serves published Chromatic Storybooks over plain localhost by attaching the
 * API token to every upstream request.
 *
 * A published Storybook answers 401 with `{"loginUrl": ...}` to anonymous
 * requests, and browser automation has no way to set an Authorization header on
 * a top-level navigation. Fronting it with a local origin sidesteps both.
 *
 * Each upstream gets its own origin, because a Storybook loads its assets from
 * paths relative to the document root — multiplexing several upstreams behind
 * one port under path prefixes breaks every one of those requests.
 */

import { readToken } from "./api";

const UPSTREAM_SUFFIX = ".chromatic.com";

function normalizeHost(input: string) {
  const host = input.startsWith("http") ? new URL(input).host : input.trim();
  const full = host.endsWith(UPSTREAM_SUFFIX) ? host : `${host}${UPSTREAM_SUFFIX}`;

  if (!/^[a-z0-9-]+\.chromatic\.com$/i.test(full)) {
    throw new Error(`Not a Chromatic Storybook host: ${input}`);
  }

  return full;
}

function serve(upstream: string, token: string) {
  const server = Bun.serve({
    // Bun listens on every interface unless told otherwise, and this proxy
    // attaches the account token to whatever it forwards, so the default would
    // hand anyone on the network an authenticated read of a private Storybook.
    hostname: "127.0.0.1",
    port: 0,
    idleTimeout: 120,
    async fetch(request) {
      const { pathname, search } = new URL(request.url);
      const response = await fetch(`https://${upstream}${pathname}${search}`, {
        headers: { Authorization: `Bearer ${token}` },
        redirect: "follow",
      });

      // Bun re-encodes the body it streams through, so the upstream's encoding
      // and length headers would describe bytes the client never receives.
      const headers = new Headers(response.headers);
      headers.delete("content-encoding");
      headers.delete("content-length");

      return new Response(response.body, { status: response.status, headers });
    },
  });

  return `http://127.0.0.1:${server.port}`;
}

const token = readToken();

const upstreams = process.argv.slice(2);
if (upstreams.length === 0) {
  throw new Error("Usage: bun proxy.ts <storybook-url-or-host> [...]");
}

for (const input of upstreams) {
  const upstream = normalizeHost(input);
  console.log(`${serve(upstream, token)}  ->  ${upstream}`);
}

console.log("\nReady. Stop with Ctrl-C or by killing this process.");
