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
import {
  mutateStablePointer,
  type StablePointerMutation,
  verifyLatestWithRollback,
} from "./stable-pointer-recovery";
import { parseRootageSnapshotVersion } from "./snapshot";

export interface RegistryVersion {
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

export interface PublishArchiveSource {
  metadata: RegistryVersion;
  tarball: Uint8Array;
  npmLatestVersion?: string;
}

export interface SnapshotPublishInput {
  version: string;
  packageUrl: string;
  packageShasum: string;
  sourceSha: string;
  publicBaseUrl: string;
}

interface SnapshotPublishOptions {
  fetch?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  publicVerifier?: PublicVerifier;
}

export type PublicVerifier = (
  baseUrl: string,
  manifest: CompletionManifest,
  alias?: "latest",
) => Promise<void>;

async function retryFetch(url: string, attempts = 12): Promise<Response> {
  let lastStatus = 0;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
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

function validateSnapshotPackageUrl(value: string, sourceSha: string): URL {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.hostname !== "pkg.pr.new" ||
    url.port ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== `/@seed-design/rootage-artifacts@${sourceSha}`
  ) {
    throw new Error("허용된 pkg.pr.new snapshot tarball URL이 아닙니다.");
  }
  return url;
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
  const packageManifest = JSON.parse(
    await readFile(join(directory, "package", "package.json"), "utf8"),
  ) as {
    name?: unknown;
    version?: unknown;
  };
  if (packageManifest.name !== PACKAGE_NAME || packageManifest.version !== metadata.version) {
    throw new Error("Rootage package.json identity가 registry version과 다릅니다.");
  }
  const root = join(directory, "package", "__generated__");
  const indexBytes = new Uint8Array(await readFile(join(root, "index.json")));
  const index: unknown = JSON.parse(new TextDecoder().decode(indexBytes));
  if (!index || typeof index !== "object" || Array.isArray(index)) {
    throw new Error("Rootage index.json이 객체가 아닙니다.");
  }
  const indexRecord = index as Record<string, unknown>;
  if (
    JSON.stringify(Object.keys(indexRecord).sort()) !==
      JSON.stringify(["name", "resources", "version"]) ||
    indexRecord.name !== "Rootage" ||
    indexRecord.version !== metadata.version ||
    !Array.isArray(indexRecord.resources)
  ) {
    throw new Error("Rootage index.json identity 또는 resources가 올바르지 않습니다.");
  }
  const resources = indexRecord.resources.map((resource, index) => {
    if (
      !resource ||
      typeof resource !== "object" ||
      Array.isArray(resource) ||
      JSON.stringify(Object.keys(resource).sort()) !== JSON.stringify(["path"]) ||
      typeof (resource as { path?: unknown }).path !== "string"
    ) {
      throw new Error(`Rootage resource ${index} 계약이 올바르지 않습니다.`);
    }
    return (resource as { path: string }).path;
  });
  const indexTypes = await readFile(join(root, "index.d.ts"), "utf8");
  const versionTypeToken = `"version": ${JSON.stringify(metadata.version)};`;
  if (indexTypes.split(versionTypeToken).length !== 2) {
    throw new Error("Rootage index.d.ts가 exact package version을 한 번 포함하지 않습니다.");
  }
  const paths = ["/index.json", ...resources];
  if (paths.some((path) => !RESOURCE_PATTERN.test(path))) {
    throw new Error("Rootage resource 경로가 올바르지 않습니다.");
  }
  const resourcePaths = paths;
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

export async function verifyRootageArchiveContract(
  tarball: Uint8Array,
  version: string,
): Promise<void> {
  if (!VERSION_PATTERN.test(version)) throw new Error(`잘못된 Rootage 버전입니다: ${version}`);
  const directory = await extractTarball(tarball);
  try {
    await loadManifest(
      directory,
      { name: PACKAGE_NAME, version, gitHead: "0".repeat(40) },
      sha512Integrity(tarball),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
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
        const response = await fetch(url, {
          headers: { "cache-control": "no-cache" },
          signal: AbortSignal.timeout(10_000),
        });
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
  npmLatestVersion: string,
): Promise<{ before: string; after: string; mutation: StablePointerMutation }> {
  if (!STABLE_VERSION_PATTERN.test(manifest.version))
    throw new Error("pre-release는 stable 포인터를 갱신할 수 없습니다.");
  if (npmLatestVersion !== manifest.version)
    throw new Error("후보가 npm latest와 일치하지 않습니다.");
  const existing = await store.get(POINTER_KEY);
  let before = "";
  if (existing) {
    const current = parsePointer(JSON.parse(new TextDecoder().decode(existing.bytes)));
    before = current.version;
    if (compareStableVersions(manifest.version, current.version) < 0)
      throw new Error("stable 포인터 역행을 거부했습니다.");
    if (current.version === manifest.version && current.manifestSha256 === manifestSha) {
      return {
        before,
        after: current.version,
        mutation: { changed: false, previous: existing, applied: existing },
      };
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
  const mutation = await mutateStablePointer(store, existing, bytes, checksum);
  return {
    before,
    after: manifest.version,
    mutation,
  };
}

export async function publishRootageArchive(
  store: ObjectStore,
  input: PublishInput,
  source: PublishArchiveSource,
  publicVerifier: PublicVerifier = verifyPublic,
): Promise<PublishResult> {
  if (!VERSION_PATTERN.test(input.version))
    throw new Error(`잘못된 Rootage 버전입니다: ${input.version}`);
  const { metadata, tarball } = source;
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
    await publicVerifier(input.publicBaseUrl, manifest);
    const pointer = input.stable
      ? await updateStable(store, manifest, manifestSha, source.npmLatestVersion ?? "")
      : {
          before: "",
          after: "",
          mutation: { changed: false, previous: null, applied: null },
        };
    if (input.stable) {
      await verifyLatestWithRollback(store, pointer.mutation, () =>
        publicVerifier(input.publicBaseUrl, manifest, "latest"),
      );
    }
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

export async function publishRootage(
  store: ObjectStore,
  input: PublishInput,
): Promise<PublishResult> {
  if (!VERSION_PATTERN.test(input.version)) {
    throw new Error(`잘못된 Rootage 버전입니다: ${input.version}`);
  }
  const metadata = await registryVersion(input.version);
  if (!metadata.dist?.tarball) throw new Error("npm Rootage metadata가 불완전합니다.");
  const tarball = new Uint8Array(await (await retryFetch(metadata.dist.tarball)).arrayBuffer());
  return publishRootageArchive(store, input, {
    metadata,
    tarball,
    npmLatestVersion: input.stable ? await latestVersion() : undefined,
  });
}

export async function publishRootageSnapshot(
  store: ObjectStore,
  input: SnapshotPublishInput,
  options: SnapshotPublishOptions = {},
): Promise<PublishResult> {
  const identity = parseRootageSnapshotVersion(input.version);
  if (!identity || identity.sourceSha !== input.sourceSha) {
    throw new Error("Rootage snapshot 버전이 승인된 source SHA와 일치하지 않습니다.");
  }
  if (!/^[0-9a-f]{40}$/.test(input.packageShasum)) {
    throw new Error("pkg.pr.new snapshot shasum은 40자리 소문자 SHA-1이어야 합니다.");
  }
  const packageUrl = validateSnapshotPackageUrl(input.packageUrl, input.sourceSha);
  const response = await (options.fetch ?? fetch)(packageUrl, {
    headers: { accept: "application/tar+gzip, application/octet-stream" },
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`pkg.pr.new snapshot tarball을 받지 못했습니다: ${response.status}`);
  }
  const declaredBytes = Number(response.headers.get("content-length") ?? "0");
  const maximumArchiveBytes = 20 * 1024 * 1024;
  if (Number.isFinite(declaredBytes) && declaredBytes > maximumArchiveBytes) {
    throw new Error("pkg.pr.new snapshot tarball이 허용 크기를 초과했습니다.");
  }
  const tarball = new Uint8Array(await response.arrayBuffer());
  if (tarball.byteLength === 0 || tarball.byteLength > maximumArchiveBytes) {
    throw new Error("pkg.pr.new snapshot tarball 크기가 올바르지 않습니다.");
  }
  const actualShasum = createHash("sha1").update(tarball).digest("hex");
  if (actualShasum !== input.packageShasum) {
    throw new Error("pkg.pr.new snapshot tarball SHA-1이 게시 결과와 다릅니다.");
  }
  const archiveIntegrity = sha512Integrity(tarball);
  return publishRootageArchive(
    store,
    {
      version: input.version,
      npmIntegrity: archiveIntegrity,
      sourceSha: input.sourceSha,
      stable: false,
      publicBaseUrl: input.publicBaseUrl,
    },
    {
      metadata: {
        name: PACKAGE_NAME,
        version: input.version,
        gitHead: input.sourceSha,
        dist: { integrity: archiveIntegrity, tarball: packageUrl.href },
      },
      tarball,
    },
    options.publicVerifier,
  );
}
