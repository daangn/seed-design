import { POINTER_KEY, sha256 } from "./contract";
import type { ObjectStore, StoredObject } from "./types";

const MAX_WRITE_ATTEMPTS = 2;
const MAX_RECONCILE_READS = 3;

class StablePointerConflictError extends Error {}

export interface StablePointerMutation {
  changed: boolean;
  previous: StoredObject | null;
  applied: StoredObject | null;
}

type ReconcileResult = { state: "applied"; object: StoredObject } | { state: "not-applied" };

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  return left.byteLength === right.byteLength && left.every((byte, index) => byte === right[index]);
}

function isExactPrevious(current: StoredObject | null, previous: StoredObject | null): boolean {
  if (!previous) return current === null;
  return (
    current !== null &&
    current.etag === previous.etag &&
    current.sha256 === previous.sha256 &&
    bytesEqual(current.bytes, previous.bytes)
  );
}

function hasExactPreviousContent(
  current: StoredObject | null,
  previous: StoredObject | null,
): boolean {
  if (!previous) return current === null;
  return (
    current !== null &&
    current.sha256 === previous.sha256 &&
    bytesEqual(current.bytes, previous.bytes)
  );
}

async function isExactIntended(
  current: StoredObject | null,
  bytes: Uint8Array,
  checksum: string,
): Promise<boolean> {
  return (
    current !== null &&
    current.sha256 === checksum &&
    bytesEqual(current.bytes, bytes) &&
    (await sha256(current.bytes)) === checksum
  );
}

async function reconcileAmbiguousWrite(
  store: ObjectStore,
  previous: StoredObject | null,
  bytes: Uint8Array,
  checksum: string,
  writeError: unknown,
): Promise<ReconcileResult> {
  let lastReadError: unknown;
  let sawIntendedWithoutEtag = false;
  for (let attempt = 1; attempt <= MAX_RECONCILE_READS; attempt += 1) {
    let current: StoredObject | null;
    try {
      current = await store.get(POINTER_KEY);
    } catch (error) {
      lastReadError = error;
      continue;
    }
    if (await isExactIntended(current, bytes, checksum)) {
      if (current?.etag) return { state: "applied", object: current };
      sawIntendedWithoutEtag = true;
      continue;
    }
    if (isExactPrevious(current, previous)) return { state: "not-applied" };
    throw new Error(
      `stable 포인터 쓰기 결과가 concurrent 변경과 구분되지 않아 중단했습니다: ${errorMessage(writeError)}`,
      { cause: writeError },
    );
  }
  const detail = sawIntendedWithoutEtag
    ? "의도한 바이트는 확인했지만 소유할 ETag가 없습니다."
    : `재조회에도 실패했습니다: ${errorMessage(lastReadError)}`;
  throw new Error(
    `stable 포인터 쓰기 결과를 안전하게 확정하지 못했습니다. ${detail} 원래 오류: ${errorMessage(writeError)}`,
    { cause: writeError },
  );
}

/**
 * Applies the stable pointer CAS and reconciles response loss from exact bytes.
 * Only an observed non-empty ETag for the intended bytes is considered owned.
 */
export async function mutateStablePointer(
  store: ObjectStore,
  previous: StoredObject | null,
  bytes: Uint8Array,
  checksum: string,
): Promise<StablePointerMutation> {
  if ((await sha256(bytes)) !== checksum) {
    throw new Error("stable 포인터 쓰기 checksum이 실제 바이트와 다릅니다.");
  }
  if (previous && !previous.etag) {
    throw new Error("기존 stable 포인터 ETag가 없어 안전한 CAS를 수행할 수 없습니다.");
  }
  if (
    previous &&
    bytesEqual(previous.bytes, bytes) &&
    (await sha256(previous.bytes)) === checksum
  ) {
    return { changed: false, previous, applied: previous };
  }

  let expected = previous;
  let lastAmbiguousError: unknown;
  for (let attempt = 1; attempt <= MAX_WRITE_ATTEMPTS; attempt += 1) {
    try {
      const result = expected
        ? await store.putIfMatch(POINTER_KEY, bytes, checksum, expected.etag)
        : await store.putIfAbsent(POINTER_KEY, bytes, checksum);
      if (result.status === "precondition-failed") {
        const current = await store.get(POINTER_KEY);
        if (await isExactIntended(current, bytes, checksum)) {
          return { changed: false, previous: current, applied: current };
        }
        if (!hasExactPreviousContent(current, expected)) {
          throw new StablePointerConflictError("stable 포인터가 실제로 동시에 변경되었습니다.");
        }
        if (current && !current.etag) {
          throw new StablePointerConflictError(
            "재조회한 stable 포인터 ETag가 없어 CAS를 다시 수행할 수 없습니다.",
          );
        }
        expected = current;
        if (attempt === MAX_WRITE_ATTEMPTS) {
          throw new StablePointerConflictError(
            current
              ? "R2가 재조회한 stable 포인터 ETag의 If-Match를 반복해서 거부했습니다."
              : "R2가 재확인한 빈 stable 포인터의 If-None-Match를 반복해서 거부했습니다.",
          );
        }
        continue;
      }
      if (result.etag) {
        return {
          changed: true,
          previous: expected,
          applied: { bytes: bytes.slice(), etag: result.etag, sha256: checksum },
        };
      }
      lastAmbiguousError = new Error("stable 포인터 CAS 응답에 ETag가 없습니다.");
    } catch (error) {
      if (error instanceof StablePointerConflictError) throw error;
      lastAmbiguousError = error;
    }

    const reconciled = await reconcileAmbiguousWrite(
      store,
      expected,
      bytes,
      checksum,
      lastAmbiguousError,
    );
    if (reconciled.state === "applied") {
      return { changed: true, previous: expected, applied: reconciled.object };
    }
  }
  throw new Error(
    `stable 포인터 쓰기가 적용되지 않아 안전한 재시도 한도를 초과했습니다: ${errorMessage(lastAmbiguousError)}`,
    { cause: lastAmbiguousError },
  );
}

/**
 * Verifies the public latest alias after a pointer CAS. If this invocation
 * changed an existing pointer, only that exact observed ETag may be rolled back.
 */
export async function verifyLatestWithRollback(
  store: ObjectStore,
  mutation: StablePointerMutation,
  verifyLatest: () => Promise<void>,
): Promise<void> {
  try {
    await verifyLatest();
    return;
  } catch (verificationError) {
    if (!mutation.changed) {
      throw new Error(
        `latest 공개 검증 실패; 현재 작업이 포인터를 변경하지 않아 자동 rollback하지 않았습니다: ${errorMessage(verificationError)}`,
        { cause: verificationError },
      );
    }
    if (!mutation.previous) {
      throw new Error(
        `latest 공개 검증 실패; 이전 stable 포인터가 없어 자동 rollback할 수 없습니다: ${errorMessage(verificationError)}`,
        { cause: verificationError },
      );
    }
    if (!mutation.applied?.etag) {
      throw new Error(
        `latest 공개 검증 실패; 적용된 stable 포인터 ETag가 없어 안전한 rollback을 거부했습니다: ${errorMessage(verificationError)}`,
        { cause: verificationError },
      );
    }

    try {
      const previousBytes = mutation.previous.bytes.slice();
      const rollback = await mutateStablePointer(
        store,
        mutation.applied,
        previousBytes,
        await sha256(previousBytes),
      );
      if (!rollback.changed || !rollback.applied?.etag) {
        throw new Error("이전 stable 포인터의 exact 복원 ETag를 확인하지 못했습니다.");
      }
    } catch (rollbackError) {
      throw new AggregateError(
        [verificationError, rollbackError],
        `latest 공개 검증 실패; stable 포인터가 동시에 변경되어 자동 rollback을 거부했습니다. 또는 rollback 결과가 모호합니다: ${errorMessage(rollbackError)}`,
      );
    }
    throw new Error(
      `latest 공개 검증 실패; 이전 stable 포인터로 자동 rollback했습니다: ${errorMessage(verificationError)}`,
      { cause: verificationError },
    );
  }
}
