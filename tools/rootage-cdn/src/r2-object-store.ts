import { S3mini } from "s3mini";
import type { ConditionalPutResult, ObjectStore, StoredObject } from "./types";

type FetchImplementation = (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;

function errorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const status = (error as { status?: unknown }).status;
  return typeof status === "number" ? status : undefined;
}

export class R2ObjectStore implements ObjectStore {
  readonly #client: S3mini;

  constructor(options: {
    accessKeyId: string;
    secretAccessKey: string;
    endpoint: string;
    fetch?: FetchImplementation;
  }) {
    const { fetch: fetchImplementation = globalThis.fetch.bind(globalThis), ...credentials } =
      options;
    this.#client = new S3mini({
      ...credentials,
      region: "auto",
      fetch: fetchImplementation as typeof fetch,
    });
  }

  async get(key: string): Promise<StoredObject | null> {
    const response = await this.#client.getObjectResponse(key);
    if (!response) return null;
    return {
      bytes: new Uint8Array(await response.arrayBuffer()),
      etag: response.headers.get("etag") ?? "",
      sha256: response.headers.get("x-amz-meta-sha256") ?? undefined,
    };
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
      return { status: "created", etag: response.headers.get("etag") ?? "" };
    } catch (error) {
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
