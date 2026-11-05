import {
  compareStableVersions,
  jsonBytes,
  manifestKey,
  parseManifest,
  parsePointer,
  POINTER_KEY,
  RESOURCE_PATTERN,
  sha256,
  STABLE_VERSION_PATTERN,
  VERSION_PATTERN,
} from "./contract";
import type { ObjectStore, StablePointer } from "./types";
import { mutateStablePointer, verifyLatestWithRollback } from "./stable-pointer-recovery";
import { ROOTAGE_PRODUCTION_SMOKE_URL, ROOTAGE_WORKER_VERSION_HEADER } from "./deployment-metadata";

export async function setStablePointer(
  store: ObjectStore,
  version: string,
  options: {
    expectedCurrent: string;
    allowRollback: boolean;
    verifyLatest?: () => Promise<void>;
  },
): Promise<{ before: string; after: string }> {
  if (!VERSION_PATTERN.test(version) || version.includes("-"))
    throw new Error("stable 대상은 정식 SemVer여야 합니다.");
  const manifestObject = await store.get(manifestKey(version));
  if (!manifestObject) throw new Error(`완료 manifest가 없습니다: ${version}`);
  const manifest = parseManifest(JSON.parse(new TextDecoder().decode(manifestObject.bytes)));
  const currentObject = await store.get(POINTER_KEY);
  if (!currentObject) throw new Error("기존 stable 포인터가 없습니다.");
  const current = parsePointer(JSON.parse(new TextDecoder().decode(currentObject.bytes)));
  if (current.version !== options.expectedCurrent)
    throw new Error("stable 포인터가 예상한 버전과 다릅니다.");
  if (!options.allowRollback && compareStableVersions(version, current.version) < 0) {
    throw new Error("명시적인 rollback 승인 없이 역행할 수 없습니다.");
  }
  const pointer: StablePointer = {
    schemaVersion: 1,
    version,
    manifestSha256: await sha256(manifestObject.bytes),
    npmIntegrity: manifest.npmIntegrity,
  };
  const bytes = jsonBytes(pointer);
  const mutation = await mutateStablePointer(store, currentObject, bytes, await sha256(bytes));
  if (options.verifyLatest) {
    await verifyLatestWithRollback(store, mutation, options.verifyLatest);
  }
  return { before: current.version, after: version };
}

export async function cleanupIncompleteVersions(
  store: ObjectStore,
  options: { olderThanDays: number; apply: boolean },
): Promise<{ candidates: string[]; deleted: number }> {
  if (!Number.isInteger(options.olderThanDays) || options.olderThanDays < 1) {
    throw new Error("보존 기간은 1일 이상의 정수여야 합니다.");
  }
  const cutoff = Date.now() - options.olderThanDays * 86_400_000;
  const objects = await store.list("versions/v");
  const grouped = new Map<string, typeof objects>();
  for (const object of objects) {
    const match = /^versions\/v([^/]+)\//.exec(object.key);
    if (!match) continue;
    const version = match[1]!;
    const group = grouped.get(version) ?? [];
    group.push(object);
    grouped.set(version, group);
  }
  const candidates: string[] = [];
  let deleted = 0;
  for (const [version, files] of grouped) {
    if (files.some((file) => file.uploaded.getTime() >= cutoff)) continue;
    if (await store.get(manifestKey(version))) continue;
    candidates.push(version);
    if (options.apply)
      for (const file of files) {
        await store.delete(file.key);
        deleted += 1;
      }
  }
  return { candidates: candidates.sort(), deleted };
}

interface WorkerRoute {
  id: string;
  pattern: string;
  script?: string;
}

interface CloudflareResponse<T> {
  success?: boolean;
  result?: T;
}

export type FetchImplementation = (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>;

export type RoutePublicVerifier = (url: string) => Promise<void>;

const ROUTE_PATTERN = "seed-design.io/rootage/*";

export interface RouteVerificationOptions {
  attempts?: number;
  expectedWorkerVersionId?: string;
  sleep?: (milliseconds: number) => Promise<void>;
}

export interface RouteMutationReconciliationOptions {
  attempts?: number;
  delayMs?: number;
  sleep?: (milliseconds: number) => Promise<void>;
}

class ConcurrentRouteMutationError extends Error {}

type RouteObservation = { kind: "absent" } | { kind: "exact"; route: WorkerRoute };

function routeId(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]+$/.test(value)) {
    throw new Error("Worker route ID가 올바르지 않습니다.");
  }
  return value;
}

function observeExactRoute(
  routes: WorkerRoute[],
  expected: Pick<WorkerRoute, "pattern" | "script"> & { id?: string },
): RouteObservation {
  const matching = routes.filter((route) => route.pattern === expected.pattern);
  if (matching.length === 0) return { kind: "absent" };
  if (matching.length !== 1) {
    throw new ConcurrentRouteMutationError(
      "같은 pattern의 Worker route가 여러 개여서 mutation 소유권을 확인할 수 없습니다.",
    );
  }
  const route = matching[0]!;
  const currentId = routeId(route.id);
  if (
    route.script !== expected.script ||
    (expected.id !== undefined && currentId !== expected.id)
  ) {
    throw new ConcurrentRouteMutationError(
      "Worker route의 exact ID 또는 script가 동시에 변경되었습니다.",
    );
  }
  return { kind: "exact", route: { ...route, id: currentId } };
}

function routeMutationRetryOptions(
  options: RouteMutationReconciliationOptions,
): Required<RouteMutationReconciliationOptions> {
  const attempts = options.attempts ?? 6;
  const delayMs = options.delayMs ?? 1_000;
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error("Worker route mutation 재시도 횟수는 1 이상의 정수여야 합니다.");
  }
  if (!Number.isInteger(delayMs) || delayMs < 0) {
    throw new Error("Worker route mutation 재시도 간격은 0 이상의 정수여야 합니다.");
  }
  return { attempts, delayMs, sleep: options.sleep ?? ((milliseconds) => Bun.sleep(milliseconds)) };
}

async function reconcileAmbiguousRouteMutation(
  base: string,
  headers: Record<string, string>,
  expected: Pick<WorkerRoute, "pattern" | "script"> & { id?: string },
  intended: "present" | "absent",
  fetchImplementation: FetchImplementation,
  options: RouteMutationReconciliationOptions,
): Promise<{ applied: false } | { applied: true; route?: WorkerRoute }> {
  const retry = routeMutationRetryOptions(options);
  let oppositeObservations = 0;
  let lastError: unknown;
  for (let attempt = 1; attempt <= retry.attempts; attempt += 1) {
    try {
      const observation = observeExactRoute(
        await listWorkerRoutes(base, headers, fetchImplementation),
        expected,
      );
      if (intended === "present" && observation.kind === "exact") {
        return { applied: true, route: observation.route };
      }
      if (intended === "absent" && observation.kind === "absent") {
        return { applied: true };
      }
      oppositeObservations += 1;
      lastError = new Error(`Worker route mutation이 아직 ${intended} 상태로 보이지 않습니다.`);
    } catch (error) {
      if (error instanceof ConcurrentRouteMutationError) throw error;
      lastError = error;
    }
    if (attempt < retry.attempts) await retry.sleep(retry.delayMs);
  }
  if (oppositeObservations === retry.attempts) return { applied: false };
  throw new Error(
    `Worker route mutation 상태를 ${retry.attempts}회 안에 확인하지 못했습니다: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
    { cause: lastError },
  );
}

async function cloudflareResult<T>(response: Response, label: string): Promise<T> {
  if (!response.ok) throw new Error(`${label}: ${response.status}`);
  const body = (await response.json()) as CloudflareResponse<T>;
  if (body.success !== true || body.result === undefined) {
    throw new Error(`${label}: Cloudflare API 응답이 올바르지 않습니다.`);
  }
  return body.result;
}

async function listWorkerRoutes(
  base: string,
  headers: Record<string, string>,
  fetchImplementation: FetchImplementation,
): Promise<WorkerRoute[]> {
  return cloudflareResult<WorkerRoute[]>(
    await fetchImplementation(base, {
      headers,
      signal: AbortSignal.timeout(15_000),
    }),
    "Worker route 조회 실패",
  );
}

export async function verifyWorkerRoutePublic(
  url: string,
  fetchImplementation: FetchImplementation = globalThis.fetch.bind(globalThis),
  options: RouteVerificationOptions = {},
): Promise<void> {
  if (url !== ROOTAGE_PRODUCTION_SMOKE_URL) {
    throw new Error("허용된 Rootage route smoke URL이 아닙니다.");
  }
  const attempts = options.attempts ?? 6;
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error("Rootage route smoke 재시도 횟수는 1 이상의 정수여야 합니다.");
  }
  const sleep = options.sleep ?? ((milliseconds: number) => Bun.sleep(milliseconds));
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const smokeUrl = new URL(url);
      smokeUrl.searchParams.set("route-smoke", `${Date.now()}-${attempt}`);
      const response = await fetchImplementation(smokeUrl, {
        headers: { "cache-control": "no-cache", accept: "application/json" },
        signal: AbortSignal.timeout(10_000),
      });
      if (
        response.ok &&
        (options.expectedWorkerVersionId === undefined ||
          response.headers.get(ROOTAGE_WORKER_VERSION_HEADER) === options.expectedWorkerVersionId)
      ) {
        const index = (await response.json()) as { version?: unknown; resources?: unknown };
        if (
          typeof index.version === "string" &&
          STABLE_VERSION_PATTERN.test(index.version) &&
          Array.isArray(index.resources) &&
          index.resources.length > 0 &&
          index.resources.every(
            (resource) =>
              typeof resource === "object" &&
              resource !== null &&
              "path" in resource &&
              typeof resource.path === "string" &&
              RESOURCE_PATTERN.test(resource.path),
          )
        ) {
          return;
        }
      }
    } catch {
      // Route propagation and transient edge failures are retried with a bound.
    }
    if (attempt < attempts) await sleep(attempt * 1_000);
  }
  throw new Error("Rootage route 공개 smoke 검증에 실패했습니다.");
}

async function rollbackCreatedRoute(
  base: string,
  headers: Record<string, string>,
  expected: WorkerRoute,
  fetchImplementation: FetchImplementation,
  reconciliationOptions: RouteMutationReconciliationOptions,
): Promise<"deleted" | "already-absent"> {
  const reconciliation = await reconcileAmbiguousRouteMutation(
    base,
    headers,
    expected,
    "present",
    fetchImplementation,
    reconciliationOptions,
  );
  if (!reconciliation.applied || !reconciliation.route) return "already-absent";
  return deleteObservedRoute(
    base,
    headers,
    reconciliation.route,
    fetchImplementation,
    reconciliationOptions,
  );
}

async function createWorkerRoute(
  base: string,
  headers: Record<string, string>,
  expected: Pick<WorkerRoute, "pattern" | "script">,
  fetchImplementation: FetchImplementation,
  reconciliationOptions: RouteMutationReconciliationOptions,
): Promise<WorkerRoute> {
  let mutationError: unknown;
  try {
    const created = await cloudflareResult<WorkerRoute>(
      await fetchImplementation(base, {
        method: "POST",
        headers,
        body: JSON.stringify({ pattern: expected.pattern, script: expected.script }),
        signal: AbortSignal.timeout(15_000),
      }),
      "Worker route 생성 실패",
    );
    return { id: routeId(created.id), pattern: expected.pattern, script: expected.script };
  } catch (error) {
    mutationError = error;
  }

  let reconciliation: Awaited<ReturnType<typeof reconcileAmbiguousRouteMutation>>;
  try {
    reconciliation = await reconcileAmbiguousRouteMutation(
      base,
      headers,
      expected,
      "present",
      fetchImplementation,
      reconciliationOptions,
    );
  } catch (reconciliationError) {
    throw new AggregateError(
      [mutationError, reconciliationError],
      "Worker route 생성 응답 유실 후 exact 적용 상태를 확인하지 못했습니다.",
    );
  }
  if (!reconciliation.applied || !reconciliation.route) {
    throw new Error("Worker route 생성이 적용되지 않아 기존 absent 상태를 유지합니다.", {
      cause: mutationError,
    });
  }
  return reconciliation.route;
}

async function deleteObservedRoute(
  base: string,
  headers: Record<string, string>,
  expected: WorkerRoute,
  fetchImplementation: FetchImplementation,
  reconciliationOptions: RouteMutationReconciliationOptions,
): Promise<"deleted"> {
  let mutationError: unknown;
  try {
    const response = await fetchImplementation(`${base}/${encodeURIComponent(expected.id)}`, {
      method: "DELETE",
      headers,
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Worker route 삭제 실패: ${response.status}`);
    return "deleted";
  } catch (error) {
    mutationError = error;
  }

  let reconciliation: Awaited<ReturnType<typeof reconcileAmbiguousRouteMutation>>;
  try {
    reconciliation = await reconcileAmbiguousRouteMutation(
      base,
      headers,
      expected,
      "absent",
      fetchImplementation,
      reconciliationOptions,
    );
  } catch (reconciliationError) {
    throw new AggregateError(
      [mutationError, reconciliationError],
      "Worker route 삭제 응답 유실 후 exact 적용 상태를 확인하지 못했습니다.",
    );
  }
  if (!reconciliation.applied) {
    throw new Error("Worker route 삭제가 적용되지 않아 exact 기존 route를 유지합니다.", {
      cause: mutationError,
    });
  }
  return "deleted";
}

async function restoreDeletedRoute(
  base: string,
  headers: Record<string, string>,
  expected: WorkerRoute,
  fetchImplementation: FetchImplementation,
  reconciliationOptions: RouteMutationReconciliationOptions,
): Promise<void> {
  const routes = await listWorkerRoutes(base, headers, fetchImplementation);
  const observation = observeExactRoute(routes, {
    pattern: expected.pattern,
    script: expected.script,
  });
  if (observation.kind === "exact") return;
  await createWorkerRoute(base, headers, expected, fetchImplementation, reconciliationOptions);
}

export async function updateWorkerRoute(
  input: {
    zoneId: string;
    apiToken: string;
    script: string;
    pattern: string;
    action: "cutover" | "rollback";
    smokeUrl: string;
  },
  dependencies: {
    fetch?: FetchImplementation;
    verifyPublic?: RoutePublicVerifier;
    mutationReconciliation?: RouteMutationReconciliationOptions;
  } = {},
): Promise<string> {
  if (input.action !== "cutover" && input.action !== "rollback")
    throw new Error("route 작업이 올바르지 않습니다.");
  if (input.pattern !== ROUTE_PATTERN) throw new Error("허용된 Rootage route pattern이 아닙니다.");
  if (input.smokeUrl !== ROOTAGE_PRODUCTION_SMOKE_URL)
    throw new Error("route 변경에는 고정된 public smoke URL이 필요합니다.");
  const fetchImplementation = dependencies.fetch ?? globalThis.fetch.bind(globalThis);
  const verifyPublic = dependencies.verifyPublic ?? ((url) => verifyWorkerRoutePublic(url));
  const base = `https://api.cloudflare.com/client/v4/zones/${input.zoneId}/workers/routes`;
  const headers = { authorization: `Bearer ${input.apiToken}`, "content-type": "application/json" };
  const routes = await listWorkerRoutes(base, headers, fetchImplementation);
  const observation = observeExactRoute(routes, {
    pattern: input.pattern,
    script: input.script,
  });
  const mutationReconciliation = dependencies.mutationReconciliation ?? {};
  if (input.action === "cutover") {
    if (observation.kind === "exact") {
      await verifyPublic(input.smokeUrl);
      return "unchanged";
    }
    const exactCreated = await createWorkerRoute(
      base,
      headers,
      { pattern: input.pattern, script: input.script },
      fetchImplementation,
      mutationReconciliation,
    );
    try {
      await verifyPublic(input.smokeUrl);
    } catch (smokeError) {
      let rollback: "deleted" | "already-absent";
      try {
        rollback = await rollbackCreatedRoute(
          base,
          headers,
          exactCreated,
          fetchImplementation,
          mutationReconciliation,
        );
      } catch (rollbackError) {
        throw new AggregateError(
          [smokeError, rollbackError],
          "Rootage route smoke 실패 후 자동 rollback을 안전하게 완료하지 못했습니다.",
        );
      }
      throw new Error(
        rollback === "deleted"
          ? "Rootage route smoke 실패 후 방금 생성한 route를 자동 rollback했습니다."
          : "Rootage route smoke 실패 후 방금 생성한 route가 이미 없어졌습니다.",
        { cause: smokeError },
      );
    }
    return "created";
  }
  if (observation.kind === "absent") {
    await verifyPublic(input.smokeUrl);
    return "unchanged";
  }
  const exactDeleted = observation.route;
  await deleteObservedRoute(
    base,
    headers,
    exactDeleted,
    fetchImplementation,
    mutationReconciliation,
  );
  try {
    await verifyPublic(input.smokeUrl);
  } catch (smokeError) {
    try {
      await restoreDeletedRoute(
        base,
        headers,
        exactDeleted,
        fetchImplementation,
        mutationReconciliation,
      );
      await verifyPublic(input.smokeUrl);
    } catch (restoreError) {
      throw new AggregateError(
        [smokeError, restoreError],
        "Rootage route 삭제 후 fallback smoke와 exact route 복구 검증이 모두 실패했습니다.",
      );
    }
    throw new Error(
      "Rootage route 삭제 후 fallback smoke가 실패하여 방금 삭제한 exact route를 복원했습니다.",
      { cause: smokeError },
    );
  }
  return "deleted";
}
