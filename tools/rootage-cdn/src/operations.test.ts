import { describe, expect, test } from "bun:test";
import { jsonBytes, sha256 } from "./contract";
import { cleanupIncompleteVersions, setStablePointer } from "./operations";
import type { ObjectStore, StoredObject } from "./types";

class MemoryStore implements ObjectStore {
  objects = new Map<string, StoredObject>();
  uploaded = new Map<string, Date>();
  deleted: string[] = [];
  async get(key: string) {
    return this.objects.get(key) ?? null;
  }
  async putIfAbsent(key: string, bytes: Uint8Array, checksum: string) {
    if (this.objects.has(key)) return { status: "precondition-failed" as const };
    this.objects.set(key, { bytes, etag: `etag-${checksum}`, sha256: checksum });
    return { status: "created" as const, etag: `etag-${checksum}` };
  }
  async putIfMatch(key: string, bytes: Uint8Array, checksum: string, etag: string) {
    if (this.objects.get(key)?.etag !== etag) return { status: "precondition-failed" as const };
    this.objects.set(key, { bytes, etag: `etag-${checksum}`, sha256: checksum });
    return { status: "created" as const, etag: `etag-${checksum}` };
  }
  async list(prefix: string) {
    return [...this.uploaded]
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, uploaded]) => ({ key, uploaded }));
  }
  async delete(key: string) {
    this.deleted.push(key);
    this.objects.delete(key);
  }
}

const integrity = `sha512-${"A".repeat(86)}==`;

describe("Rootage 운영 명령", () => {
  test("stable rollback도 현재 ETag와 예상 버전을 확인한다", async () => {
    const store = new MemoryStore();
    const manifest = jsonBytes({
      schemaVersion: 1,
      package: "@seed-design/rootage-artifacts",
      version: "1.0.0",
      npmIntegrity: integrity,
      gitHead: "b".repeat(40),
      files: [
        {
          path: "/index.json",
          key: "versions/v1.0.0/index.json",
          bytes: 2,
          sha256: "a".repeat(64),
        },
      ],
    });
    store.objects.set("manifests/v1.0.0.json", { bytes: manifest, etag: "manifest" });
    const pointer = jsonBytes({
      schemaVersion: 1,
      version: "2.0.0",
      manifestSha256: "c".repeat(64),
      npmIntegrity: integrity,
    });
    store.objects.set("pointers/stable.json", { bytes: pointer, etag: "current" });
    expect(
      await setStablePointer(store, "1.0.0", { expectedCurrent: "2.0.0", allowRollback: true }),
    ).toEqual({ before: "2.0.0", after: "1.0.0" });
    expect(
      JSON.parse(new TextDecoder().decode(store.objects.get("pointers/stable.json")!.bytes))
        .manifestSha256,
    ).toBe(await sha256(manifest));
  });

  test("완료 manifest가 없는 오래된 버전만 정리한다", async () => {
    const store = new MemoryStore();
    store.uploaded.set("versions/v0.9.0/index.json", new Date(0));
    store.uploaded.set("versions/v1.0.0/index.json", new Date(0));
    store.objects.set("manifests/v1.0.0.json", { bytes: new Uint8Array(), etag: "complete" });
    const report = await cleanupIncompleteVersions(store, { olderThanDays: 7, apply: false });
    expect(report.candidates).toEqual(["0.9.0"]);
    await cleanupIncompleteVersions(store, { olderThanDays: 7, apply: true });
    expect(store.deleted).toEqual(["versions/v0.9.0/index.json"]);
  });
});
