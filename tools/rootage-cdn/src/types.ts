export interface CompletionFile {
  path: string;
  key: string;
  bytes: number;
  sha256: string;
}

export interface CompletionManifest {
  schemaVersion: 1;
  package: "@seed-design/rootage-artifacts";
  version: string;
  npmIntegrity: string;
  gitHead: string;
  files: CompletionFile[];
}

export interface StablePointer {
  schemaVersion: 1;
  version: string;
  manifestSha256: string;
  npmIntegrity: string;
}

export interface StoredObject {
  bytes: Uint8Array;
  etag: string;
  sha256?: string;
}

export type ConditionalPutResult =
  | { status: "created"; etag: string }
  | { status: "precondition-failed" };

export interface ObjectStore {
  get(key: string): Promise<StoredObject | null>;
  putIfAbsent(key: string, bytes: Uint8Array, sha256: string): Promise<ConditionalPutResult>;
  putIfMatch(
    key: string,
    bytes: Uint8Array,
    sha256: string,
    etag: string,
  ): Promise<ConditionalPutResult>;
  list(prefix: string): Promise<Array<{ key: string; uploaded: Date }>>;
  delete(key: string): Promise<void>;
}
