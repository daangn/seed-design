import { STABLE_VERSION_PATTERN, VERSION_PATTERN } from "./contract";

export const rootageOperationNames = [
  "backfill-version",
  "backfill-stable",
  "route-cutover",
  "route-rollback",
  "stable-rollback",
  "worker-rollback",
  "cleanup-report",
  "cleanup-apply",
] as const;

export type RootageOperationName = (typeof rootageOperationNames)[number];

export interface RootageOperationInput {
  operation: string;
  version?: string;
  expectedCurrent?: string;
  npmIntegrity?: string;
  sourceSha?: string;
  workerVersionId?: string;
  expectedWorkerVersionId?: string;
  confirm?: string;
}

export interface ValidRootageOperationInput {
  operation: RootageOperationName;
  version: string;
  expectedCurrent: string;
  npmIntegrity: string;
  sourceSha: string;
  workerVersionId: string;
  expectedWorkerVersionId: string;
  confirm: string;
}

const NPM_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]+={0,2}$/;
const SOURCE_SHA_PATTERN = /^[0-9a-f]{40}$/;
const WORKER_VERSION_ID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;

function normalized(value: string | undefined): string {
  return value?.trim() ?? "";
}

function requireValue(value: string, label: string): void {
  if (!value) throw new Error(`${label} 입력이 필요합니다.`);
}

function rejectValue(value: string, label: string, operation: RootageOperationName): void {
  if (value) throw new Error(`${operation} 작업에는 ${label} 입력을 사용할 수 없습니다.`);
}

export function validateRootageOperationInput(
  input: RootageOperationInput,
): ValidRootageOperationInput {
  if (!rootageOperationNames.includes(input.operation as RootageOperationName)) {
    throw new Error(`지원하지 않는 Rootage 작업입니다: ${input.operation}`);
  }
  const operation = input.operation as RootageOperationName;
  const result: ValidRootageOperationInput = {
    operation,
    version: normalized(input.version),
    expectedCurrent: normalized(input.expectedCurrent),
    npmIntegrity: normalized(input.npmIntegrity),
    sourceSha: normalized(input.sourceSha),
    workerVersionId: normalized(input.workerVersionId),
    expectedWorkerVersionId: normalized(input.expectedWorkerVersionId),
    confirm: normalized(input.confirm),
  };

  if (operation === "backfill-version" || operation === "backfill-stable") {
    requireValue(result.version, "version");
    requireValue(result.npmIntegrity, "npm-integrity");
    requireValue(result.sourceSha, "source-sha");
    if (!VERSION_PATTERN.test(result.version))
      throw new Error("version이 유효한 SemVer가 아닙니다.");
    if (operation === "backfill-stable" && !STABLE_VERSION_PATTERN.test(result.version)) {
      throw new Error("backfill-stable은 정식 SemVer만 허용합니다.");
    }
    if (!NPM_INTEGRITY_PATTERN.test(result.npmIntegrity)) {
      throw new Error("npm-integrity가 유효한 sha512 SRI가 아닙니다.");
    }
    if (!SOURCE_SHA_PATTERN.test(result.sourceSha)) {
      throw new Error("source-sha는 40자리 소문자 Git SHA여야 합니다.");
    }
    rejectValue(result.expectedCurrent, "expected-current", operation);
    rejectValue(result.workerVersionId, "worker-version-id", operation);
    rejectValue(result.expectedWorkerVersionId, "expected-worker-version-id", operation);
    rejectValue(result.confirm, "confirm", operation);
    return result;
  }

  if (operation === "stable-rollback") {
    requireValue(result.version, "version");
    requireValue(result.expectedCurrent, "expected-current");
    if (
      !STABLE_VERSION_PATTERN.test(result.version) ||
      !STABLE_VERSION_PATTERN.test(result.expectedCurrent)
    ) {
      throw new Error("stable rollback 버전은 정식 SemVer여야 합니다.");
    }
    rejectValue(result.npmIntegrity, "npm-integrity", operation);
    rejectValue(result.sourceSha, "source-sha", operation);
    rejectValue(result.workerVersionId, "worker-version-id", operation);
    rejectValue(result.expectedWorkerVersionId, "expected-worker-version-id", operation);
    rejectValue(result.confirm, "confirm", operation);
    return result;
  }

  if (operation === "worker-rollback") {
    requireValue(result.workerVersionId, "worker-version-id");
    requireValue(result.expectedWorkerVersionId, "expected-worker-version-id");
    if (
      !WORKER_VERSION_ID_PATTERN.test(result.workerVersionId) ||
      !WORKER_VERSION_ID_PATTERN.test(result.expectedWorkerVersionId)
    ) {
      throw new Error("Worker version ID는 소문자 UUID 형식이어야 합니다.");
    }
    if (result.workerVersionId === result.expectedWorkerVersionId) {
      throw new Error("worker-rollback 대상은 현재 예상 Worker version과 달라야 합니다.");
    }
    rejectValue(result.version, "version", operation);
    rejectValue(result.expectedCurrent, "expected-current", operation);
    rejectValue(result.npmIntegrity, "npm-integrity", operation);
    rejectValue(result.sourceSha, "source-sha", operation);
    rejectValue(result.confirm, "confirm", operation);
    return result;
  }

  if (operation === "cleanup-apply") {
    if (result.confirm !== "DELETE-INCOMPLETE") {
      throw new Error("cleanup-apply 확인 문구는 DELETE-INCOMPLETE여야 합니다.");
    }
  } else {
    rejectValue(result.confirm, "confirm", operation);
  }
  rejectValue(result.version, "version", operation);
  rejectValue(result.expectedCurrent, "expected-current", operation);
  rejectValue(result.npmIntegrity, "npm-integrity", operation);
  rejectValue(result.sourceSha, "source-sha", operation);
  rejectValue(result.workerVersionId, "worker-version-id", operation);
  rejectValue(result.expectedWorkerVersionId, "expected-worker-version-id", operation);
  return result;
}
