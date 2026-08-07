import { createHash } from "node:crypto";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  compareStableVersions,
  jsonBytes,
  manifestKey,
  PACKAGE_NAME,
  parseManifest,
  parsePointer,
  POINTER_KEY,
  RESOURCE_PATTERN,
  sha256,
  STABLE_VERSION_PATTERN,
  VERSION_PATTERN,
} from "./contract";
import type { CompletionFile, CompletionManifest, ObjectStore, StablePointer } from "./types";

interface RegistryVersion {
  name?: string;
  version?: string;
  gitHead?: string;
  dist?: { integrity?: string; tarball?: string };
}

export interface PublishInput {
  version: string;
  npmIntegrity: string;
  sourceSha: string;
  stable: boolean;
  publicBaseUrl: string;
}

export interface PublishResult {
  manifestSha: string;
  fileCount: number;
  pointerBefore: string;
  pointerAfter: string;
  reusedManifest: boolean;
}

async function retryFetch(url: string, attempts = 12): Promise<Response> {
  let lastStatus = 0;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { accept: "application/json" } });
      lastStatus = response.status;
      if (response.ok) return response;
      if (response.status < 500 && response.status !== 429) break;
    } catch {
      // bounded retry handles registry propagation and transient network failures
    }
    if (attempt < attempts) await Bun.sleep(Math.min(1_000 * 2 ** (attempt - 1), 10_000));
  }
  throw new Error(`요청 재시도 한도를 초과했습니다: ${url} (${lastStatus || "network"})`);
}

async function registryVersion(version: string): Promise<RegistryVersion> {
  const encoded = encodeURIComponent(PACKAGE_NAME);
  return (await (
    await retryFetch(`https://registry.npmjs.org/${encoded}/${version}`)
  ).json()) as RegistryVersion;
}

async function latestVersion(): Promise<string> {
  const metadata = await registryVersion("latest");
  if (!metadata.version || !STABLE_VERSION_PATTERN.test(metadata.version)) {
    throw new Error("npm latest가 stable SemVer가 아닙니다.");
  }
  return metadata.version;
}

function sha512Integrity(bytes: Uint8Array): string {
  return `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
}

async function extractTarball(bytes: Uint8Array): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "rootage-cdn-"));
  const archive = join(directory, "package.tgz");
  await writeFile(archive, bytes);
  const list = Bun.spawn(["tar", "-tzf", archive], { stdout: "pipe", stderr: "pipe" });
  const entries = (await new Response(list.stdout).text()).split("\n").filter(Boolean);
  if (
    (await list.exited) !== 0 ||
    entries.some((entry) => entry.includes("..") || entry.startsWith("/"))
  ) {
    await rm(directory, { recursive: true, force: true });
    throw new Error("npm tarball 경로가 안전하지 않습니다.");
  }
  const extract = Bun.spawn([
    "tar",
    "-xzf",
    archive,
    "-C",
    directory,
    "--no-same-owner",
    "--no-same-permissions",
  ]);
  if ((await extract.exited) !== 0) {
    await rm(directory, { recursive: true, force: true });
    throw new Error("npm tarball을 추출하지 못했습니다.");
  }
  return directory;
}

async function loadManifest(
  directory: string,
  metadata: RegistryVersion,
  integrity: string,
): Promise<CompletionManifest> {
  const root = join(directory, "package", "__generated__");
  const indexBytes = new Uint8Array(await readFile(join(root, "index.json")));
  const index = JSON.parse(new TextDecoder().decode(indexBytes)) as {
    version?: unknown;
    resources?: Array<{ path?: unknown }>;
  };
  if (index.version !== metadata.version || !Array.isArray(index.resources)) {
    throw new Error("Rootage index.json 버전 또는 resources가 올바르지 않습니다.");
  }
  const paths: unknown[] = ["/index.json", ...index.resources.map((resource) => resource.path)];
  if (paths.some((path) => typeof path !== "string" || !RESOURCE_PATTERN.test(path))) {
    throw new Error("Rootage resource 경로가 올바르지 않습니다.");
  }
  const resourcePaths = paths as string[];
  if (new Set(resourcePaths).size !== resourcePaths.length)
    throw new Error("Rootage resource 경로가 중복되었습니다.");
  const generatedFiles = (await readdir(root, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) =>
      `/${join(entry.parentPath.slice(root.length + 1), entry.name)}`.replaceAll("\\", "/"),
    )
    .sort();
  const sortedPaths = [...resourcePaths].sort();
  if (
    generatedFiles.length !== sortedPaths.length ||
    generatedFiles.some((path, index) => path !== sortedPaths[index])
  ) {
    throw new Error("Rootage index 목록 밖 JSON 또는 누락된 JSON이 있습니다.");
  }
  const files: CompletionFile[] = [];
  for (const path of sortedPaths) {
    const bytes = new Uint8Array(await readFile(join(root, path.slice(1))));
    JSON.parse(new TextDecoder().decode(bytes));
    files.push({
      path,
      key: `versions/v${metadata.version}${path}`,
      bytes: bytes.byteLength,
      sha256: await sha256(bytes),
    });
  }
  return parseManifest({
    schemaVersion: 1,
    package: PACKAGE_NAME,
    version: metadata.version,
    npmIntegrity: integrity,
    gitHead: metadata.gitHead,
    files,
  });
}

async function putImmutable(
  store: ObjectStore,
  key: string,
  bytes: Uint8Array,
  checksum: string,
): Promise<"created" | "reused"> {
  const result = await store.putIfAbsent(key, bytes, checksum);
  if (result.status === "created") return "created";
  const existing = await store.get(key);
  if (!existing || (await sha256(existing.bytes)) !== checksum) {
    throw new Error(`불변 R2 객체 충돌입니다: ${key}`);
  }
  return "reused";
}

export async function verifyPublic(
  baseUrl: string,
  manifest: CompletionManifest,
  alias?: "latest",
): Promise<void> {
  for (const file of manifest.files) {
    const prefix = alias ?? `v${manifest.version}`;
    const url = `${baseUrl.replace(/\/$/, "")}/rootage/${prefix}${file.path}`;
    let verified = false;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
      try {
        const response = await fetch(url, { headers: { "cache-control": "no-cache" } });
        const bytes = response.ok ? new Uint8Array(await response.arrayBuffer()) : null;
        verified = bytes !== null && (await sha256(bytes)) === file.sha256;
      } catch {
        verified = false;
      }
      if (verified) break;
      if (attempt < 5) await Bun.sleep(attempt * 1_000);
    }
    if (!verified) throw new Error(`공개 URL checksum 불일치: ${file.path}`);
  }
}

async function updateStable(
  store: ObjectStore,
  manifest: CompletionManifest,
  manifestSha: string,
): Promise<{ before: string; after: string }> {
  if (!STABLE_VERSION_PATTERN.test(manifest.version))
    throw new Error("pre-release는 stable 포인터를 갱신할 수 없습니다.");
  if ((await latestVersion()) !== manifest.version)
    throw new Error("후보가 npm latest와 일치하지 않습니다.");
  const existing = await store.get(POINTER_KEY);
  let before = "";
  if (existing) {
    const current = parsePointer(JSON.parse(new TextDecoder().decode(existing.bytes)));
    before = current.version;
    if (compareStableVersions(manifest.version, current.version) < 0)
      throw new Error("stable 포인터 역행을 거부했습니다.");
    if (current.version === manifest.version && current.manifestSha256 === manifestSha) {
      return { before, after: current.version };
    }
  }
  const pointer: StablePointer = {
    schemaVersion: 1,
    version: manifest.version,
    manifestSha256: manifestSha,
    npmIntegrity: manifest.npmIntegrity,
  };
  const bytes = jsonBytes(pointer);
  const checksum = await sha256(bytes);
  const result = existing
    ? await store.putIfMatch(POINTER_KEY, bytes, checksum, existing.etag)
    : await store.putIfAbsent(POINTER_KEY, bytes, checksum);
  if (result.status === "precondition-failed")
    throw new Error("stable 포인터가 동시에 변경되었습니다.");
  return { before, after: manifest.version };
}

export async function publishRootage(
  store: ObjectStore,
  input: PublishInput,
): Promise<PublishResult> {
  if (!VERSION_PATTERN.test(input.version))
    throw new Error(`잘못된 Rootage 버전입니다: ${input.version}`);
  const metadata = await registryVersion(input.version);
  if (
    metadata.name !== PACKAGE_NAME ||
    metadata.version !== input.version ||
    !metadata.gitHead ||
    !metadata.dist?.tarball
  ) {
    throw new Error("npm Rootage metadata가 불완전합니다.");
  }
  if (metadata.dist.integrity !== input.npmIntegrity)
    throw new Error("전달된 npm integrity가 registry와 다릅니다.");
  if (metadata.gitHead !== input.sourceSha)
    throw new Error("npm gitHead가 승인된 source SHA와 다릅니다.");
  const tarball = new Uint8Array(await (await retryFetch(metadata.dist.tarball)).arrayBuffer());
  if (sha512Integrity(tarball) !== input.npmIntegrity)
    throw new Error("npm tarball integrity가 일치하지 않습니다.");
  const directory = await extractTarball(tarball);
  try {
    const manifest = await loadManifest(directory, metadata, input.npmIntegrity);
    const generatedRoot = join(directory, "package", "__generated__");
    for (const file of manifest.files) {
      const bytes = new Uint8Array(await readFile(join(generatedRoot, file.path.slice(1))));
      await putImmutable(store, file.key, bytes, file.sha256);
      const stored = await store.get(file.key);
      if (!stored || (await sha256(stored.bytes)) !== file.sha256)
        throw new Error(`R2 재검증 실패: ${file.key}`);
    }
    const manifestBytes = jsonBytes(manifest);
    const manifestSha = await sha256(manifestBytes);
    const manifestStatus = await putImmutable(
      store,
      manifestKey(input.version),
      manifestBytes,
      manifestSha,
    );
    await verifyPublic(input.publicBaseUrl, manifest);
    const pointer = input.stable
      ? await updateStable(store, manifest, manifestSha)
      : { before: "", after: "" };
    if (input.stable) await verifyPublic(input.publicBaseUrl, manifest, "latest");
    return {
      manifestSha,
      fileCount: manifest.files.length,
      pointerBefore: pointer.before,
      pointerAfter: pointer.after,
      reusedManifest: manifestStatus === "reused",
    };
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
