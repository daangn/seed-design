import {
  compareStableVersions,
  jsonBytes,
  manifestKey,
  parseManifest,
  parsePointer,
  POINTER_KEY,
  sha256,
  VERSION_PATTERN,
} from "./contract";
import type { ObjectStore, StablePointer } from "./types";

export async function setStablePointer(
  store: ObjectStore,
  version: string,
  options: { expectedCurrent: string; allowRollback: boolean },
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
  const result = await store.putIfMatch(
    POINTER_KEY,
    bytes,
    await sha256(bytes),
    currentObject.etag,
  );
  if (result.status === "precondition-failed")
    throw new Error("stable 포인터가 동시에 변경되었습니다.");
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

export async function updateWorkerRoute(input: {
  zoneId: string;
  apiToken: string;
  script: string;
  pattern: string;
  action: "cutover" | "rollback";
}): Promise<string> {
  if (input.action !== "cutover" && input.action !== "rollback")
    throw new Error("route 작업이 올바르지 않습니다.");
  if (input.pattern !== "seed-design.io/rootage/*")
    throw new Error("허용된 Rootage route pattern이 아닙니다.");
  const base = `https://api.cloudflare.com/client/v4/zones/${input.zoneId}/workers/routes`;
  const headers = { authorization: `Bearer ${input.apiToken}`, "content-type": "application/json" };
  const listResponse = await fetch(base, { headers });
  if (!listResponse.ok) throw new Error(`Worker route 조회 실패: ${listResponse.status}`);
  const body = (await listResponse.json()) as {
    result?: Array<{ id: string; pattern: string; script?: string }>;
  };
  const route = body.result?.find((candidate) => candidate.pattern === input.pattern);
  if (input.action === "cutover") {
    if (route?.script === input.script) return "unchanged";
    if (route)
      throw new Error(`같은 pattern을 다른 Worker가 사용 중입니다: ${route.script ?? "unknown"}`);
    const response = await fetch(base, {
      method: "POST",
      headers,
      body: JSON.stringify({ pattern: input.pattern, script: input.script }),
    });
    if (!response.ok) throw new Error(`Worker route 생성 실패: ${response.status}`);
    return "created";
  }
  if (!route) return "unchanged";
  if (route.script !== input.script) throw new Error("다른 Worker의 route는 삭제하지 않습니다.");
  const response = await fetch(`${base}/${route.id}`, { method: "DELETE", headers });
  if (!response.ok) throw new Error(`Worker route 삭제 실패: ${response.status}`);
  return "deleted";
}
