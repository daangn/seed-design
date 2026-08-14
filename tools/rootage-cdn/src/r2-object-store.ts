import { S3mini } from "s3mini";
import { POINTER_KEY } from "./contract";
import type { ConditionalPutResult, ObjectStore, StoredObject } from "./types";

type FetchImplementation = (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;
type DiagnosticWriter = (entry: Record<string, unknown>) => void;

function etagDiagnostic(etag: string): Record<string, unknown> {
  const opaqueTag = etag.startsWith("W/") ? etag.slice(2) : etag;
  return {
    value: etag,
    length: etag.length,
    quoted: opaqueTag.startsWith('"') && opaqueTag.endsWith('"'),
    weak: etag.startsWith("W/"),
  };
}

function errorDiagnostic(error: unknown): Record<string, unknown> {
  if (!error || typeof error !== "object") return { message: String(error) };
  const value = error as {
    name?: unknown;
    message?: unknown;
    status?: unknown;
    serviceCode?: unknown;
    body?: unknown;
  };
  return {
    name: typeof value.name === "string" ? value.name : undefined,
    message: typeof value.message === "string" ? value.message : String(error),
    status: typeof value.status === "number" ? value.status : undefined,
    serviceCode: typeof value.serviceCode === "string" ? value.serviceCode : undefined,
    body: typeof value.body === "string" ? value.body.slice(0, 1_000) : undefined,
  };
}

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

export class R2ObjectStore implements ObjectStore {
  readonly #client: S3mini;
  readonly #diagnostic?: DiagnosticWriter;

  constructor(options: {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    fetch?: FetchImplementation;
    diagnostic?: DiagnosticWriter;
  }) {
    const {
      fetch: fetchImplementation = globalThis.fetch.bind(globalThis),
      diagnostic,
      ...credentials
    } = options;
    this.#diagnostic = diagnostic;
    this.#client = new S3mini({
      ...credentials,
      region: "auto",
      fetch: fetchImplementation as typeof fetch,
    });
  }

  async get(key: string): Promise<StoredObject | null> {
    const response = await this.#client.getObjectResponse(key);
    if (!response) {
      if (key === POINTER_KEY) this.#diagnostic?.({ event: "r2-get", key, outcome: "not-found" });
      return null;
    }
    const object = {
      bytes: new Uint8Array(await response.arrayBuffer()),
      etag: response.headers.get("etag") ?? "",
      sha256: response.headers.get("x-amz-meta-sha256") ?? undefined,
    };
    if (key === POINTER_KEY) {
      this.#diagnostic?.({
        event: "r2-get",
        key,
        outcome: "found",
        etag: etagDiagnostic(object.etag),
        metadataSha256: object.sha256,
      });
    }
    return object;
  }

  async #put(
    key: string,
    bytes: Uint8Array,
    sha256: string,
    condition: Record<string, string>,
  ): Promise<ConditionalPutResult> {
    const headers: Record<string, string> = {
      ...condition,
      "cache-control": "private, no-store",
      "x-amz-meta-sha256": sha256,
    };
    try {
      const response = await this.#client.putObject(
        key,
        bytes,
        "application/json; charset=utf-8",
        undefined,
        headers,
        bytes.byteLength,
      );
      const etag = response.headers.get("etag") ?? "";
      if (key === POINTER_KEY) {
        this.#diagnostic?.({
          event: "r2-conditional-put",
          key,
          condition: Object.fromEntries(
            Object.entries(condition).map(([name, value]) => [
              name,
              name === "if-match" ? etagDiagnostic(value) : value,
            ]),
          ),
          outcome: "created",
          responseEtag: etagDiagnostic(etag),
        });
      }
      return { status: "created", etag };
    } catch (error) {
      if (key === POINTER_KEY) {
        this.#diagnostic?.({
          event: "r2-conditional-put",
          key,
          condition: Object.fromEntries(
            Object.entries(condition).map(([name, value]) => [
              name,
              name === "if-match" ? etagDiagnostic(value) : value,
            ]),
          ),
          outcome: errorStatus(error) === 412 ? "precondition-failed" : "error",
          error: errorDiagnostic(error),
        });
      }
      if (errorStatus(error) === 412) return { status: "precondition-failed" };
      throw error;
    }
  }

  putIfAbsent(key: string, bytes: Uint8Array, sha256: string): Promise<ConditionalPutResult> {
    return this.#put(key, bytes, sha256, { "if-none-match": "*" });
  }

  putIfMatch(
    key: string,
    bytes: Uint8Array,
    sha256: string,
    etag: string,
  ): Promise<ConditionalPutResult> {
    return this.#put(key, bytes, sha256, { "if-match": etag });
  }

  async list(prefix: string): Promise<Array<{ key: string; uploaded: Date }>> {
    const objects = await this.#client.listObjects("/", prefix);
    return (objects ?? []).map((item) => ({ key: item.Key, uploaded: item.LastModified }));
  }

  async delete(key: string): Promise<void> {
    if (!(await this.#client.deleteObject(key)))
      throw new Error(`R2 객체를 삭제하지 못했습니다: ${key}`);
  }
}
