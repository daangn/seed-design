import { describe, expect, test } from "bun:test";
import { jsonBytes, POINTER_KEY, sha256 } from "./contract";
import { mutateStablePointer, verifyLatestWithRollback } from "./stable-pointer-recovery";
import type { ObjectStore, StoredObject } from "./types";

type PutFault =
  | "success"
  | "apply-then-throw"
  | "apply-with-empty-response-etag"
  | "apply-without-any-etag"
  | "apply-intended-then-precondition"
  | "concurrent-then-throw"
  | "concurrent-then-precondition"
  | "refresh-etag-then-precondition"
  | "precondition-failed"
  | "throw";

class FaultStore implements ObjectStore {
  object: StoredObject | null;
  faults: PutFault[];
  putCalls = 0;

  constructor(object: StoredObject | null, faults: PutFault[]) {
    this.object = object;
    this.faults = [...faults];
  }

  async get(key: string): Promise<StoredObject | null> {
    expect(key).toBe(POINTER_KEY);
    if (!this.object) return null;
    return {
      bytes: this.object.bytes.slice(),
      etag: this.object.etag,
      sha256: this.object.sha256,
    };
  }

  async #put(bytes: Uint8Array, checksum: string, condition: boolean) {
    this.putCalls += 1;
    if (!condition) return { status: "precondition-failed" as const };
    const fault = this.faults.shift() ?? "success";
    if (fault === "precondition-failed") return { status: "precondition-failed" as const };
    if (fault === "refresh-etag-then-precondition") {
      if (this.object) this.object = { ...this.object, etag: "refreshed" };
      return { status: "precondition-failed" as const };
    }
    if (fault === "apply-intended-then-precondition") {
      this.object = { bytes: bytes.slice(), etag: "concurrent-intended", sha256: checksum };
      return { status: "precondition-failed" as const };
    }
    if (fault === "throw") throw new Error("R2 response failed before apply");
    if (fault === "concurrent-then-throw" || fault === "concurrent-then-precondition") {
      const concurrentBytes = jsonBytes({ concurrent: true });
      this.object = {
        bytes: concurrentBytes,
        etag: "concurrent",
        sha256: await sha256(concurrentBytes),
      };
      if (fault === "concurrent-then-precondition") {
        return { status: "precondition-failed" as const };
      }
      throw new Error("R2 response lost while another writer won");
    }
    const etag = `owned-${this.putCalls}`;
    this.object = {
      bytes: bytes.slice(),
      etag: fault === "apply-without-any-etag" ? "" : etag,
      sha256: checksum,
    };
    if (fault === "apply-then-throw") throw new Error("R2 response lost after apply");
    return {
      status: "created" as const,
      etag:
        fault === "apply-with-empty-response-etag" || fault === "apply-without-any-etag"
          ? ""
          : etag,
    };
  }

  putIfAbsent(_key: string, bytes: Uint8Array, checksum: string) {
    return this.#put(bytes, checksum, this.object === null);
  }

  putIfMatch(_key: string, bytes: Uint8Array, checksum: string, etag: string) {
    return this.#put(bytes, checksum, this.object?.etag === etag);
  }

  async list() {
    return [];
  }

  async delete() {
    throw new Error("stable pointer recovery never deletes objects");
  }
}

async function storedPointer(version: string, etag: string): Promise<StoredObject> {
  const bytes = jsonBytes({
    schemaVersion: 1,
    version,
    manifestSha256: version.replaceAll(".", "").padEnd(64, "0"),
    npmIntegrity: `sha512-${"A".repeat(86)}==`,
  });
  return { bytes, etag, sha256: await sha256(bytes) };
}

describe("stable pointer ambiguous-write recovery", () => {
  test("accepted If-Match CAS의 response loss는 exact intended object와 observed ETag로 확정한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["apply-then-throw"]);

    const mutation = await mutateStablePointer(store, previous, intended.bytes, intended.sha256!);

    expect(mutation.changed).toBe(true);
    expect(mutation.applied?.etag).toBe("owned-1");
    expect(store.object?.bytes).toEqual(intended.bytes);
    expect(store.putCalls).toBe(1);
  });

  test("If-None-Match 응답 ETag가 비어도 exact stored object의 ETag를 소유한다", async () => {
    const intended = await storedPointer("1.0.0", "unused");
    const store = new FaultStore(null, ["apply-with-empty-response-etag"]);

    const mutation = await mutateStablePointer(store, null, intended.bytes, intended.sha256!);

    expect(mutation.applied?.etag).toBe("owned-1");
    expect(store.object?.bytes).toEqual(intended.bytes);
    expect(store.putCalls).toBe(1);
  });

  test("response failure 뒤 exact pre-state면 한 번만 안전하게 재시도한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["throw", "success"]);

    const mutation = await mutateStablePointer(store, previous, intended.bytes, intended.sha256!);

    expect(mutation.applied?.etag).toBe("owned-2");
    expect(store.putCalls).toBe(2);
  });

  test("412 뒤 이전 bytes의 새 ETag를 관찰하면 새 기준으로 한 번만 CAS한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["refresh-etag-then-precondition", "success"]);

    const mutation = await mutateStablePointer(store, previous, intended.bytes, intended.sha256!);

    expect(mutation.changed).toBe(true);
    expect(mutation.previous?.etag).toBe("refreshed");
    expect(mutation.applied?.etag).toBe("owned-2");
    expect(store.putCalls).toBe(2);
  });

  test("412 뒤 목표 bytes가 이미 보이면 다른 writer의 적용을 소유하지 않는다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["apply-intended-then-precondition"]);

    const mutation = await mutateStablePointer(store, previous, intended.bytes, intended.sha256!);

    expect(mutation.changed).toBe(false);
    expect(mutation.applied?.etag).toBe("concurrent-intended");
    expect(store.putCalls).toBe(1);
  });

  test("412 뒤 동일 ETag가 그대로여도 재조회한 상태로 한 번만 다시 CAS한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["precondition-failed", "success"]);

    const mutation = await mutateStablePointer(store, previous, intended.bytes, intended.sha256!);

    expect(mutation.changed).toBe(true);
    expect(mutation.previous?.etag).toBe("previous");
    expect(mutation.applied?.etag).toBe("owned-2");
    expect(store.putCalls).toBe(2);
  });

  test("재조회한 동일 ETag도 412가 반복되면 R2 If-Match 오류로 중단한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["precondition-failed", "precondition-failed"]);

    await expect(
      mutateStablePointer(store, previous, intended.bytes, intended.sha256!),
    ).rejects.toThrow("If-Match를 반복해서 거부했습니다");
    expect(store.putCalls).toBe(2);
  });

  test("412 뒤 다른 bytes가 보이면 실제 concurrent write로 fail-closed한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["concurrent-then-precondition"]);

    await expect(
      mutateStablePointer(store, previous, intended.bytes, intended.sha256!),
    ).rejects.toThrow("실제로 동시에 변경되었습니다");
    expect(store.putCalls).toBe(1);
  });

  test("stored object에도 ETag가 없으면 intended bytes가 맞아도 소유권을 주장하지 않는다", async () => {
    const intended = await storedPointer("1.0.0", "unused");
    const store = new FaultStore(null, ["apply-without-any-etag"]);

    await expect(
      mutateStablePointer(store, null, intended.bytes, intended.sha256!),
    ).rejects.toThrow("소유할 ETag가 없습니다");
    expect(store.putCalls).toBe(1);
  });

  test("ambiguous response 뒤 다른 bytes가 보이면 concurrent write로 fail-closed한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["concurrent-then-throw"]);

    await expect(
      mutateStablePointer(store, previous, intended.bytes, intended.sha256!),
    ).rejects.toThrow("concurrent 변경과 구분되지 않아 중단했습니다");
    expect(store.putCalls).toBe(1);
  });

  test("자동 rollback 응답이 유실되어도 exact previous bytes와 새 ETag를 재확인한다", async () => {
    const previous = await storedPointer("1.0.0", "previous");
    const intended = await storedPointer("1.1.0", "unused");
    const store = new FaultStore(previous, ["success", "apply-then-throw"]);
    const mutation = await mutateStablePointer(store, previous, intended.bytes, intended.sha256!);

    await expect(
      verifyLatestWithRollback(store, mutation, async () => {
        throw new Error("latest mismatch");
      }),
    ).rejects.toThrow("이전 stable 포인터로 자동 rollback했습니다");
    expect(store.object?.bytes).toEqual(previous.bytes);
    expect(store.object?.etag).toBe("owned-2");
    expect(store.putCalls).toBe(2);
  });
});
