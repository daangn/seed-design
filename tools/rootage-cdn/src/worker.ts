import { manifestKey, parseManifest, parsePointer, POINTER_KEY, sha256 } from "./contract";
import { ROOTAGE_WORKER_VERSION_HEADER } from "./deployment-metadata";
import { parseRootagePath, type RootageRoute } from "./request-path";

interface R2ObjectBody {
  body: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
}

interface R2BucketLike {
  get(key: string): Promise<R2ObjectBody | null>;
  head(key: string): Promise<unknown | null>;
}

interface AnalyticsLike {
  writeDataPoint(point: { blobs: string[]; doubles: number[]; indexes: string[] }): void;
}

interface WorkerVersionMetadataLike {
  id: string;
  tag: string;
  timestamp: string;
}

export interface WorkerEnv {
  ROOTAGE_BUCKET: R2BucketLike;
  CF_VERSION_METADATA: WorkerVersionMetadataLike;
  ROOTAGE_ANALYTICS?: AnalyticsLike;
  ROOTAGE_ENVIRONMENT?: string;
}

const JSON_TYPE = "application/json; charset=utf-8";
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, HEAD, OPTIONS",
  "access-control-allow-headers": "If-None-Match",
};

function response(status: number, body: BodyInit | null = null, headers?: HeadersInit): Response {
  return new Response(body, { status, headers: { ...CORS_HEADERS, ...headers } });
}

function cacheControl(route: RootageRoute): string {
  return route.kind === "version" ? "public, max-age=31536000, immutable" : "no-cache";
}

async function readJson(
  bucket: R2BucketLike,
  key: string,
): Promise<{ value: unknown; bytes: Uint8Array } | null> {
  const object = await bucket.get(key);
  if (!object) return null;
  const bytes = new Uint8Array(await object.arrayBuffer());
  return { value: JSON.parse(new TextDecoder().decode(bytes)), bytes };
}

async function resolveManifest(env: WorkerEnv, route: RootageRoute) {
  let version: string;
  let expectedManifestSha: string | undefined;
  if (route.kind === "version") {
    version = route.version;
  } else {
    const storedPointer = await readJson(env.ROOTAGE_BUCKET, POINTER_KEY);
    if (!storedPointer) throw new Error("stable 포인터가 없습니다.");
    const pointer = parsePointer(storedPointer.value);
    version = pointer.version;
    expectedManifestSha = pointer.manifestSha256;
  }
  const storedManifest = await readJson(env.ROOTAGE_BUCKET, manifestKey(version));
  if (!storedManifest) return null;
  if (expectedManifestSha && (await sha256(storedManifest.bytes)) !== expectedManifestSha) {
    throw new Error("stable 포인터의 manifest checksum이 일치하지 않습니다.");
  }
  return parseManifest(storedManifest.value);
}

function record(env: WorkerEnv, route: RootageRoute | null, status: number): void {
  env.ROOTAGE_ANALYTICS?.writeDataPoint({
    blobs: [
      env.ROOTAGE_ENVIRONMENT ?? "unknown",
      route?.kind ?? "invalid",
      String(Math.floor(status / 100)),
    ],
    doubles: [1],
    indexes: ["rootage"],
  });
}

export async function handleRequest(request: Request, env: WorkerEnv): Promise<Response> {
  const route = parseRootagePath(new URL(request.url).pathname);
  if (request.method === "OPTIONS") {
    const result = response(route ? 204 : 404);
    record(env, route, result.status);
    return result;
  }
  if (!route) {
    const result = response(404);
    record(env, route, result.status);
    return result;
  }
  if (request.method !== "GET" && request.method !== "HEAD") {
    const result = response(405, null, { allow: "GET, HEAD, OPTIONS" });
    record(env, route, result.status);
    return result;
  }
  try {
    const manifest = await resolveManifest(env, route);
    const file = manifest?.files.find((candidate) => candidate.path === route.path);
    if (!manifest || !file) {
      const result = response(404);
      record(env, route, result.status);
      return result;
    }
    const etag = `"${file.sha256}"`;
    const headers = {
      "content-type": JSON_TYPE,
      "cache-control": cacheControl(route),
      etag,
      [ROOTAGE_WORKER_VERSION_HEADER]: env.CF_VERSION_METADATA.id,
    };
    if (request.headers.get("if-none-match") === etag) {
      const result = response(304, null, headers);
      record(env, route, result.status);
      return result;
    }
    if (request.method === "HEAD") {
      const object = await env.ROOTAGE_BUCKET.head(file.key);
      const result = object
        ? response(200, null, { ...headers, "content-length": String(file.bytes) })
        : response(503);
      record(env, route, result.status);
      return result;
    }
    const object = await env.ROOTAGE_BUCKET.get(file.key);
    if (!object) {
      const result = response(503);
      record(env, route, result.status);
      return result;
    }
    const bytes = new Uint8Array(await object.arrayBuffer());
    if (bytes.byteLength !== file.bytes || (await sha256(bytes)) !== file.sha256) {
      const result = response(503);
      record(env, route, result.status);
      return result;
    }
    const result = response(200, bytes, { ...headers, "content-length": String(file.bytes) });
    record(env, route, result.status);
    return result;
  } catch {
    const result = response(503);
    record(env, route, result.status);
    return result;
  }
}

export default {
  fetch(request: Request, env: WorkerEnv): Promise<Response> {
    return handleRequest(request, env);
  },
};
