const TIMEOUT_MS = 60_000;

async function signRequest(
  secret: string,
  method: string,
  path: string,
): Promise<{ "x-seed-timestamp": string; "x-seed-signature": string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `${method}\n${path}\n${timestamp}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  const hexSignature = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return {
    "x-seed-timestamp": timestamp,
    "x-seed-signature": hexSignature,
  };
}

export async function POST(req: Request) {
  const agentUrl = process.env.SEED_DOCS_AGENT_URL;
  const hmacSecret = process.env.SEED_DOCS_AGENT_HMAC_SECRET;

  if (!agentUrl || !hmacSecret) {
    return Response.json({ error: "Chat service not configured" }, { status: 503 });
  }

  const targetUrl = `${agentUrl.replace(/\/+$/, "")}/api/chat`;

  let body: string;
  try {
    body = await req.text();
  } catch {
    return Response.json({ error: "Failed to read request body" }, { status: 400 });
  }

  const authHeaders = await signRequest(hmacSecret, "POST", "/api/chat");

  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-seed-timestamp": authHeaders["x-seed-timestamp"],
    "x-seed-signature": authHeaders["x-seed-signature"],
  };

  let agentResponse: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    agentResponse = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return Response.json({ error: "Request timeout" }, { status: 504 });
    }
    return Response.json({ error: "Failed to reach chat service" }, { status: 502 });
  }

  return new Response(agentResponse.body, {
    status: agentResponse.status,
    headers: {
      "content-type": agentResponse.headers.get("content-type") ?? "text/event-stream",
      "cache-control": "no-cache",
      "x-accel-buffering": "no",
    },
  });
}
