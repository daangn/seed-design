import type { CompletionManifest, StablePointer } from "./types";

export const PACKAGE_NAME = "@seed-design/rootage-artifacts" as const;
export const POINTER_KEY = "pointers/stable.json";
export const VERSION_PATTERN = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
export const STABLE_VERSION_PATTERN = /^\d+\.\d+\.\d+$/;
export const RESOURCE_PATTERN = /^\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.json$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/;
export const NPM_INTEGRITY_PATTERN = /^sha512-[A-Za-z0-9+/]+={0,2}$/;
const SHA_PATTERN = /^[0-9a-f]{40}$/;

function object(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${name}은 객체여야 합니다.`);
  }
  return value as Record<string, unknown>;
}

function exactKeys(value: Record<string, unknown>, keys: string[], name: string): void {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new Error(`${name} 필드가 올바르지 않습니다: ${actual.join(", ")}`);
  }
}

export function parseManifest(value: unknown): CompletionManifest {
  const manifest = object(value, "완료 manifest");
  exactKeys(
    manifest,
    ["schemaVersion", "package", "version", "npmIntegrity", "gitHead", "files"],
    "완료 manifest",
  );
  if (manifest.schemaVersion !== 1 || manifest.package !== PACKAGE_NAME) {
    throw new Error("완료 manifest 식별자가 올바르지 않습니다.");
  }
  if (typeof manifest.version !== "string" || !VERSION_PATTERN.test(manifest.version)) {
    throw new Error("완료 manifest 버전이 올바르지 않습니다.");
  }
  if (
    typeof manifest.npmIntegrity !== "string" ||
    !NPM_INTEGRITY_PATTERN.test(manifest.npmIntegrity)
  ) {
    throw new Error("완료 manifest npm integrity가 올바르지 않습니다.");
  }
  if (typeof manifest.gitHead !== "string" || !SHA_PATTERN.test(manifest.gitHead)) {
    throw new Error("완료 manifest gitHead가 올바르지 않습니다.");
  }
  if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
    throw new Error("완료 manifest 파일 목록이 비어 있습니다.");
  }
  const files = manifest.files.map((candidate, index) => {
    const file = object(candidate, `완료 manifest 파일 ${index}`);
    exactKeys(file, ["path", "key", "bytes", "sha256"], `완료 manifest 파일 ${index}`);
    if (typeof file.path !== "string" || !RESOURCE_PATTERN.test(file.path)) {
      throw new Error(`완료 manifest 파일 경로가 올바르지 않습니다: ${String(file.path)}`);
    }
    const expectedKey = `versions/v${manifest.version}${file.path}`;
    if (file.key !== expectedKey) throw new Error("완료 manifest R2 key가 올바르지 않습니다.");
    if (!Number.isInteger(file.bytes) || Number(file.bytes) < 1) {
      throw new Error("완료 manifest 파일 크기가 올바르지 않습니다.");
    }
    if (typeof file.sha256 !== "string" || !SHA256_PATTERN.test(file.sha256)) {
      throw new Error("완료 manifest 파일 checksum이 올바르지 않습니다.");
    }
    return { path: file.path, key: expectedKey, bytes: Number(file.bytes), sha256: file.sha256 };
  });
  const paths = files.map((file) => file.path);
  if (
    new Set(paths).size !== paths.length ||
    paths.some((path, index) => index > 0 && path <= paths[index - 1]!)
  ) {
    throw new Error("완료 manifest 파일은 중복 없이 경로순이어야 합니다.");
  }
  return {
    schemaVersion: 1,
    package: PACKAGE_NAME,
    version: manifest.version,
    npmIntegrity: manifest.npmIntegrity,
    gitHead: manifest.gitHead,
    files,
  };
}

export function parsePointer(value: unknown): StablePointer {
  const pointer = object(value, "stable 포인터");
  exactKeys(
    pointer,
    ["schemaVersion", "version", "manifestSha256", "npmIntegrity"],
    "stable 포인터",
  );
  if (pointer.schemaVersion !== 1) throw new Error("stable 포인터 형식 버전이 올바르지 않습니다.");
  if (typeof pointer.version !== "string" || !STABLE_VERSION_PATTERN.test(pointer.version)) {
    throw new Error("stable 포인터 버전이 올바르지 않습니다.");
  }
  if (typeof pointer.manifestSha256 !== "string" || !SHA256_PATTERN.test(pointer.manifestSha256)) {
    throw new Error("stable 포인터 manifest checksum이 올바르지 않습니다.");
  }
  if (
    typeof pointer.npmIntegrity !== "string" ||
    !NPM_INTEGRITY_PATTERN.test(pointer.npmIntegrity)
  ) {
    throw new Error("stable 포인터 npm integrity가 올바르지 않습니다.");
  }
  return pointer as unknown as StablePointer;
}

export function manifestKey(version: string): string {
  if (!VERSION_PATTERN.test(version)) throw new Error(`잘못된 Rootage 버전입니다: ${version}`);
  return `manifests/v${version}.json`;
}

export function jsonBytes(value: unknown): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(value, null, 2)}\n`);
}

export async function sha256(bytes: Uint8Array): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes.slice().buffer);
  return [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
}

export function compareStableVersions(left: string, right: string): number {
  const a = left.split(".").map(Number);
  const b = right.split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (a[index]! !== b[index]!) return a[index]! < b[index]! ? -1 : 1;
  }
  return 0;
}
