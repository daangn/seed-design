/**
 * Minimal client for Chromatic's GraphQL API.
 *
 * The token is read from the environment on every call and never returned or
 * logged, so callers can pass results around without leaking the credential.
 */

const ENDPOINT = "https://www.chromatic.com/api";

export function readToken() {
  const token = process.env.CHROMATIC_TOKEN?.trim();
  if (!token) {
    throw new Error("CHROMATIC_TOKEN is not set. See references/token.md for how to obtain one.");
  }

  return token;
}

/**
 * Expiry of the configured token, or null when it cannot be decoded.
 *
 * Chromatic issues these for 30 days, and an expired one fails with a generic
 * authorization error that reads like a permissions problem, so checking up
 * front turns a confusing failure into an actionable one.
 */
export function tokenExpiry() {
  const payload = readToken().split(".")[1];
  if (!payload) return null;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };

    return exp ? new Date(exp * 1000) : null;
  } catch {
    return null;
  }
}

export async function query<T>(document: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${readToken()}`,
    },
    body: JSON.stringify({ query: document, variables }),
  });

  const body = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  const failure = body.errors?.[0]?.message;
  if (!body.data) {
    throw new Error(failure ?? `Chromatic API returned HTTP ${response.status}`);
  }

  return body.data;
}

/**
 * The API rejects field aliases, so a query cannot be batched and every
 * build/branch/status combination costs its own request. Eight in flight keeps
 * a full sweep around ten seconds without tripping rate limits.
 */
export async function pool<In, Out>(items: In[], worker: (item: In) => Promise<Out>, limit = 8) {
  const results: Out[] = new Array(items.length);
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await worker(items[index]);
      }
    }),
  );

  return results;
}
