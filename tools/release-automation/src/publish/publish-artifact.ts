import { createHash } from "node:crypto";
import {
  appendFile,
  copyFile,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { verifyRootageArchiveContract } from "../../../rootage-cdn/src/publisher";
import { isLaneName } from "../core/config";
import { parseSemver } from "./publish";
import {
  assertExactRegistryDistTags,
  assertExactRegistryIntegrities,
  fetchRegistryDocuments,
  inspectRegistryGitHeads,
  parseNpmIntegrity,
} from "./publish-state";
import type { LaneName } from "../core/types";

const gitShaPattern = /^[0-9a-f]{40}$/;
const sha256Pattern = /^[0-9a-f]{64}$/;
const packageNamePattern = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const distTagPattern = /^[a-z][a-z0-9-]{0,31}$/;
const archivePathPattern = /^tarballs\/[0-9]{4}\.tgz$/;
const maxArchiveBytes = 256 * 1024 * 1024;
const maxUnpackedBytes = 1024 * 1024 * 1024;
const maxTarEntries = 100_000;
const sanitizedChangesetsConfig = {
  $schema: "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  changelog: false,
  commit: false,
  fixed: [],
  linked: [],
  access: "public",
  baseBranch: "dev",
  updateInternalDependencies: "patch",
  ignore: [],
  privatePackages: { version: false, tag: false },
};

export interface PlannedPublishPackage {
  name: string;
  version: string;
  path: string;
}

export interface PublishArtifactPackage extends PlannedPublishPackage {
  archive: string;
  integrity: string;
  sha256: string;
  size: number;
}

export interface PublishArtifactManifest {
  schemaVersion: 1;
  mode: "dry-run" | "production";
  lane: LaneName;
  mergeSha: string;
  distTag: string;
  packages: PublishArtifactPackage[];
}

interface VerifyArtifactOptions {
  artifactPath: string;
  repositoryPath: string;
  expectedMode: "dry-run" | "production";
  expectedLane: LaneName;
  expectedMergeSha: string;
  expectedDistTag: string;
  expectedPackages: PlannedPublishPackage[];
}

interface PublishEnvironment {
  ignoreScripts: string | undefined;
  provenance: string | undefined;
  registry: string | undefined;
  idTokenUrl: string | undefined;
  idTokenToken: string | undefined;
  npmVersion: string;
  changesetsVersion: string;
}

function assertObject(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label}이 객체가 아닙니다.`);
  }
}

function assertExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  label: string,
): void {
  const actual = Object.keys(value).sort();
  const wanted = [...expected].sort();
  if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
    throw new Error(`${label} 키가 strict schema와 다릅니다.`);
  }
}

function isSafeRelativeDirectory(path: string): boolean {
  return (
    path !== "" &&
    path !== "." &&
    !path.startsWith("/") &&
    !path.includes("\\") &&
    !/[\0\r\n]/.test(path) &&
    path.split("/").every((part) => part !== "" && part !== "." && part !== "..")
  );
}

function parsePlannedPackage(value: unknown, label: string): PlannedPublishPackage {
  assertObject(value, label);
  assertExactKeys(value, ["name", "path", "version"], label);
  if (typeof value.name !== "string" || !packageNamePattern.test(value.name)) {
    throw new Error(`${label} package 이름이 올바르지 않습니다.`);
  }
  if (typeof value.version !== "string") throw new Error(`${label} version이 없습니다.`);
  parseSemver(value.version);
  if (typeof value.path !== "string" || !isSafeRelativeDirectory(value.path)) {
    throw new Error(`${label} source path가 올바르지 않습니다.`);
  }
  return { name: value.name, version: value.version, path: value.path };
}

export function parsePlannedPublishPackages(value: string): PlannedPublishPackage[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("게시 package plan이 비어 있거나 배열이 아닙니다.");
  }
  const packages = parsed.map((item, index) => parsePlannedPackage(item, `package[${index}]`));
  const names = new Set<string>();
  const paths = new Set<string>();
  for (const item of packages) {
    if (names.has(item.name) || paths.has(item.path)) {
      throw new Error("게시 package plan에 중복 name 또는 path가 있습니다.");
    }
    names.add(item.name);
    paths.add(item.path);
  }
  return packages;
}

function parseArtifactPackage(value: unknown, index: number): PublishArtifactPackage {
  const label = `artifact package[${index}]`;
  assertObject(value, label);
  assertExactKeys(
    value,
    ["archive", "integrity", "name", "path", "sha256", "size", "version"],
    label,
  );
  const planned = parsePlannedPackage(
    { name: value.name, path: value.path, version: value.version },
    label,
  );
  if (typeof value.archive !== "string" || !archivePathPattern.test(value.archive)) {
    throw new Error(`${label} archive path가 올바르지 않습니다.`);
  }
  if (typeof value.sha256 !== "string" || !sha256Pattern.test(value.sha256)) {
    throw new Error(`${label} SHA-256이 올바르지 않습니다.`);
  }
  if (typeof value.integrity !== "string") throw new Error(`${label} npm integrity가 없습니다.`);
  parseNpmIntegrity(value.integrity);
  if (
    typeof value.size !== "number" ||
    !Number.isSafeInteger(value.size) ||
    value.size <= 0 ||
    value.size > maxArchiveBytes
  ) {
    throw new Error(`${label} archive size가 올바르지 않습니다.`);
  }
  return {
    ...planned,
    archive: value.archive,
    integrity: value.integrity,
    sha256: value.sha256,
    size: value.size,
  };
}

export function parsePublishArtifactManifest(value: unknown): PublishArtifactManifest {
  assertObject(value, "publish artifact manifest");
  assertExactKeys(
    value,
    ["distTag", "lane", "mergeSha", "mode", "packages", "schemaVersion"],
    "publish artifact manifest",
  );
  if (value.schemaVersion !== 1) throw new Error("지원하지 않는 artifact schema입니다.");
  if (value.mode !== "dry-run" && value.mode !== "production") {
    throw new Error("artifact mode가 올바르지 않습니다.");
  }
  if (typeof value.lane !== "string" || !isLaneName(value.lane)) {
    throw new Error("artifact lane이 올바르지 않습니다.");
  }
  if (typeof value.mergeSha !== "string" || !gitShaPattern.test(value.mergeSha)) {
    throw new Error("artifact merge SHA가 올바르지 않습니다.");
  }
  if (typeof value.distTag !== "string" || !distTagPattern.test(value.distTag)) {
    throw new Error("artifact dist-tag가 올바르지 않습니다.");
  }
  if (!Array.isArray(value.packages) || value.packages.length === 0) {
    throw new Error("artifact package 목록이 비어 있습니다.");
  }
  const packages = value.packages.map(parseArtifactPackage);
  const names = new Set<string>();
  const paths = new Set<string>();
  const archives = new Set<string>();
  for (const item of packages) {
    if (names.has(item.name) || paths.has(item.path) || archives.has(item.archive)) {
      throw new Error("artifact package에 중복 name, path 또는 archive가 있습니다.");
    }
    names.add(item.name);
    paths.add(item.path);
    archives.add(item.archive);
  }
  return {
    schemaVersion: 1,
    mode: value.mode,
    lane: value.lane,
    mergeSha: value.mergeSha,
    distTag: value.distTag,
    packages,
  };
}

function canonicalPackages(packages: PlannedPublishPackage[]): string {
  return JSON.stringify(
    packages
      .map(({ name, path, version }) => ({ name, path, version }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  );
}

async function git(repositoryPath: string, arguments_: string[]): Promise<string> {
  const child = Bun.spawn(["git", ...arguments_], {
    cwd: repositoryPath,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`git ${arguments_.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function assertExactWorktree(repositoryPath: string, mergeSha: string): Promise<void> {
  if (!gitShaPattern.test(mergeSha)) throw new Error("승인 merge SHA가 올바르지 않습니다.");
  const head = await git(repositoryPath, ["rev-parse", "HEAD"]);
  if (head !== mergeSha) {
    throw new Error(`artifact source checkout ${head}이 승인 merge SHA ${mergeSha}와 다릅니다.`);
  }
}

function decodeTarString(block: Uint8Array, offset: number, length: number): string {
  const field = block.subarray(offset, offset + length);
  const end = field.indexOf(0);
  return new TextDecoder("utf-8", { fatal: true }).decode(
    end === -1 ? field : field.subarray(0, end),
  );
}

function parseTarOctal(block: Uint8Array, offset: number, length: number, label: string): number {
  const field = block.subarray(offset, offset + length);
  if ((field[0] ?? 0) & 0x80)
    throw new Error(`${label}의 base-256 tar number는 허용하지 않습니다.`);
  const raw = new TextDecoder().decode(field).replace(/\0.*$/s, "").trim();
  if (!/^[0-7]+$/.test(raw)) throw new Error(`${label} tar number가 올바르지 않습니다.`);
  const value = Number.parseInt(raw, 8);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${label} 값이 너무 큽니다.`);
  return value;
}

function tarChecksum(block: Uint8Array): number {
  let sum = 0;
  for (let index = 0; index < block.length; index += 1) {
    sum += index >= 148 && index < 156 ? 0x20 : (block[index] ?? 0);
  }
  return sum;
}

function parsePax(data: Uint8Array): Map<string, string> {
  const fields = new Map<string, string>();
  let offset = 0;
  while (offset < data.length) {
    const space = data.indexOf(0x20, offset);
    if (space < 0) throw new Error("PAX record 길이가 없습니다.");
    const lengthText = new TextDecoder().decode(data.subarray(offset, space));
    if (!/^[1-9][0-9]*$/.test(lengthText)) throw new Error("PAX record 길이가 올바르지 않습니다.");
    const length = Number(lengthText);
    const end = offset + length;
    if (!Number.isSafeInteger(length) || end > data.length || data[end - 1] !== 0x0a) {
      throw new Error("PAX record 경계가 올바르지 않습니다.");
    }
    const record = new TextDecoder("utf-8", { fatal: true }).decode(
      data.subarray(space + 1, end - 1),
    );
    const separator = record.indexOf("=");
    if (separator <= 0) throw new Error("PAX record key/value가 올바르지 않습니다.");
    const key = record.slice(0, separator);
    const value = record.slice(separator + 1);
    if (fields.has(key) || /[\0\r\n]/.test(key) || /[\0\r\n]/.test(value)) {
      throw new Error("PAX record가 중복되었거나 제어 문자를 포함합니다.");
    }
    fields.set(key, value);
    offset = end;
  }
  return fields;
}

function safeTarPath(value: string, directory: boolean): string {
  const path = directory && value.endsWith("/") ? value.slice(0, -1) : value;
  if (
    path === "" ||
    path.startsWith("/") ||
    path.includes("\\") ||
    /[\0\r\n]/.test(path) ||
    path.split("/").some((part) => part === "" || part === "." || part === "..") ||
    (path !== "package" && !path.startsWith("package/"))
  ) {
    throw new Error(`tar entry path가 안전하지 않습니다: ${JSON.stringify(value)}`);
  }
  return path;
}

function tarPackageJson(archive: Uint8Array): Record<string, unknown> {
  const unpacked = gunzipSync(archive, { maxOutputLength: maxUnpackedBytes });
  let offset = 0;
  let entries = 0;
  let packageJson: Uint8Array | null = null;
  let nextPath: string | null = null;
  let nextPax: Map<string, string> | null = null;
  let terminated = false;
  const paths = new Set<string>();

  while (offset + 512 <= unpacked.length) {
    const header = unpacked.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      if (!unpacked.subarray(offset).every((byte) => byte === 0)) {
        throw new Error("tar 종료 block 뒤에 데이터가 있습니다.");
      }
      terminated = true;
      break;
    }
    entries += 1;
    if (entries > maxTarEntries) throw new Error("tar entry가 허용 한도를 넘었습니다.");
    const expectedChecksum = parseTarOctal(header, 148, 8, "checksum");
    if (expectedChecksum !== tarChecksum(header))
      throw new Error("tar header checksum이 다릅니다.");
    const size = parseTarOctal(header, 124, 12, "size");
    const mode = parseTarOctal(header, 100, 8, "mode");
    if (mode > 0o777 || (mode & 0o022) !== 0) {
      throw new Error("tar entry에 특수 bit 또는 group/world write mode가 있습니다.");
    }
    const type = String.fromCharCode(header[156] ?? 0).replace("\0", "");
    const prefix = decodeTarString(header, 345, 155);
    const headerName = decodeTarString(header, 0, 100);
    const rawName = prefix ? `${prefix}/${headerName}` : headerName;
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    if (dataEnd > unpacked.length) throw new Error("tar entry data가 archive 경계를 넘습니다.");
    const data = unpacked.subarray(dataStart, dataEnd);

    if (type === "x") {
      if (nextPax) throw new Error("PAX header가 연속으로 중복되었습니다.");
      nextPax = parsePax(data);
    } else if (type === "L") {
      if (nextPath) throw new Error("GNU long path header가 중복되었습니다.");
      nextPath = new TextDecoder("utf-8", { fatal: true }).decode(data).replace(/\0+$/, "");
    } else {
      if (type !== "" && type !== "0" && type !== "5") {
        throw new Error(`tar entry type ${JSON.stringify(type)}은 허용되지 않습니다.`);
      }
      if (nextPax?.has("linkpath")) throw new Error("PAX linkpath는 허용되지 않습니다.");
      const paxSize = nextPax?.get("size");
      if (
        paxSize !== undefined &&
        (!/^(0|[1-9][0-9]*)$/.test(paxSize) || Number(paxSize) !== size)
      ) {
        throw new Error("PAX size가 tar header와 다릅니다.");
      }
      const path = safeTarPath(nextPax?.get("path") ?? nextPath ?? rawName, type === "5");
      if (paths.has(path)) throw new Error(`tar entry path가 중복되었습니다: ${path}`);
      paths.add(path);
      if (path === "package/package.json") {
        if (type === "5" || size === 0 || size > 1024 * 1024) {
          throw new Error("tar package.json이 regular file이 아니거나 크기가 올바르지 않습니다.");
        }
        packageJson = new Uint8Array(data);
      }
      nextPath = null;
      nextPax = null;
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  if (nextPath || nextPax) throw new Error("적용 대상이 없는 tar 확장 header가 있습니다.");
  if (!terminated) throw new Error("tar archive 종료 block이 없습니다.");
  if (!packageJson) throw new Error("tarball에 package/package.json이 없습니다.");
  const parsed: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(packageJson));
  assertObject(parsed, "tarball package.json");
  return parsed;
}

async function sha256File(path: string): Promise<string> {
  const bytes = new Uint8Array(await readFile(path));
  return createHash("sha256").update(bytes).digest("hex");
}

async function npmIntegrityFile(path: string): Promise<string> {
  const bytes = new Uint8Array(await readFile(path));
  return `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
}

async function assertSafeArtifactFile(path: string, executable: boolean): Promise<number> {
  const file = await lstat(path);
  if (!file.isFile() || file.isSymbolicLink())
    throw new Error(`${path}은 regular file이 아닙니다.`);
  if ((file.mode & 0o022) !== 0 || (!executable && (file.mode & 0o111) !== 0)) {
    throw new Error(`${path}의 filesystem mode가 안전하지 않습니다.`);
  }
  if (!Number.isSafeInteger(file.size) || file.size <= 0 || file.size > maxArchiveBytes) {
    throw new Error(`${path}의 파일 크기가 올바르지 않습니다.`);
  }
  return file.size;
}

async function readAndVerifyArchive(
  artifactPath: string,
  item: PublishArtifactPackage,
): Promise<void> {
  const archivePath = resolve(artifactPath, item.archive);
  if (relative(resolve(artifactPath), archivePath).startsWith("..")) {
    throw new Error("artifact archive가 root 밖을 가리킵니다.");
  }
  const size = await assertSafeArtifactFile(archivePath, false);
  if (size !== item.size) throw new Error(`${item.name} tarball size가 manifest와 다릅니다.`);
  if ((await sha256File(archivePath)) !== item.sha256) {
    throw new Error(`${item.name} tarball SHA-256이 manifest와 다릅니다.`);
  }
  if ((await npmIntegrityFile(archivePath)) !== item.integrity) {
    throw new Error(`${item.name} tarball npm integrity가 manifest와 다릅니다.`);
  }
  const archive = new Uint8Array(await readFile(archivePath));
  const packageJson = tarPackageJson(archive);
  if (
    packageJson.name !== item.name ||
    packageJson.version !== item.version ||
    packageJson.private === true
  ) {
    throw new Error(`${item.name} tarball name/version/private가 승인 plan과 다릅니다.`);
  }
  if (packageJson.gitHead !== undefined) {
    throw new Error(`${item.name} tarball은 npm이 계산하기 전 gitHead를 포함할 수 없습니다.`);
  }
  const publishConfig = packageJson.publishConfig;
  if (publishConfig !== undefined) {
    assertObject(publishConfig, `${item.name} publishConfig`);
    if (Object.keys(publishConfig).some((key) => key !== "access" && key !== "registry")) {
      throw new Error(`${item.name} tarball publishConfig에 허용되지 않은 키가 있습니다.`);
    }
    if (publishConfig.access !== undefined && publishConfig.access !== "public") {
      throw new Error(`${item.name} tarball access가 public이 아닙니다.`);
    }
    if (
      publishConfig.registry !== undefined &&
      publishConfig.registry !== "https://registry.npmjs.org"
    ) {
      throw new Error(`${item.name} tarball registry가 npmjs가 아닙니다.`);
    }
  }
  if (item.name === "@seed-design/rootage-artifacts") {
    await verifyRootageArchiveContract(archive, item.version);
  }
}

async function assertExactArtifactTree(
  artifactPath: string,
  manifest: PublishArtifactManifest,
): Promise<void> {
  const root = await lstat(artifactPath);
  if (!root.isDirectory() || root.isSymbolicLink() || (root.mode & 0o022) !== 0) {
    throw new Error("artifact root directory mode/type이 안전하지 않습니다.");
  }
  const rootEntries = (await readdir(artifactPath)).sort();
  if (JSON.stringify(rootEntries) !== JSON.stringify(["manifest.json", "tarballs"])) {
    throw new Error("artifact root에 예상하지 않은 파일이 있습니다.");
  }
  const tarballsPath = join(artifactPath, "tarballs");
  const tarballs = await lstat(tarballsPath);
  if (!tarballs.isDirectory() || tarballs.isSymbolicLink() || (tarballs.mode & 0o022) !== 0) {
    throw new Error("artifact tarballs directory mode/type이 안전하지 않습니다.");
  }
  const actualArchives = (await readdir(tarballsPath)).map((name) => `tarballs/${name}`).sort();
  const expectedArchives = manifest.packages.map((item) => item.archive).sort();
  if (JSON.stringify(actualArchives) !== JSON.stringify(expectedArchives)) {
    throw new Error("artifact tarball 파일 목록이 manifest와 다릅니다.");
  }
}

export async function verifyPublishArtifact(
  options: VerifyArtifactOptions,
): Promise<PublishArtifactManifest> {
  await assertExactWorktree(options.repositoryPath, options.expectedMergeSha);
  const manifestPath = join(options.artifactPath, "manifest.json");
  const manifestSize = await assertSafeArtifactFile(manifestPath, false);
  if (manifestSize > 1024 * 1024) throw new Error("artifact manifest가 너무 큽니다.");
  const manifest = parsePublishArtifactManifest(JSON.parse(await readFile(manifestPath, "utf8")));
  if (
    manifest.mode !== options.expectedMode ||
    manifest.lane !== options.expectedLane ||
    manifest.mergeSha !== options.expectedMergeSha ||
    manifest.distTag !== options.expectedDistTag ||
    canonicalPackages(manifest.packages) !== canonicalPackages(options.expectedPackages)
  ) {
    throw new Error("artifact가 승인된 mode/lane/merge/dist-tag/package plan과 다릅니다.");
  }
  await assertExactArtifactTree(options.artifactPath, manifest);
  for (const item of manifest.packages) await readAndVerifyArchive(options.artifactPath, item);
  return manifest;
}

async function run(command: string[], cwd: string): Promise<string> {
  const child = Bun.spawn(command, { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  if (code !== 0) throw new Error(`${command.join(" ")} 실패:\n${stderr}`);
  return stdout.trim();
}

async function buildArtifact(options: VerifyArtifactOptions): Promise<PublishArtifactManifest> {
  await assertExactWorktree(options.repositoryPath, options.expectedMergeSha);
  await mkdir(options.artifactPath);
  const tarballsPath = join(options.artifactPath, "tarballs");
  await mkdir(tarballsPath);
  const packages: PublishArtifactPackage[] = [];
  for (const [index, item] of options.expectedPackages.entries()) {
    const sourcePath = resolve(options.repositoryPath, item.path);
    if (relative(resolve(options.repositoryPath), sourcePath).startsWith("..")) {
      throw new Error(`${item.name} source path가 repository 밖을 가리킵니다.`);
    }
    const packageJson = JSON.parse(await readFile(join(sourcePath, "package.json"), "utf8")) as {
      name?: unknown;
      version?: unknown;
      private?: unknown;
    };
    if (
      packageJson.name !== item.name ||
      packageJson.version !== item.version ||
      packageJson.private
    ) {
      throw new Error(`${item.name} source manifest가 승인 plan과 다릅니다.`);
    }
    const before = new Set(await readdir(tarballsPath));
    await run(["bun", "pm", "pack", "--destination", tarballsPath, "--quiet"], sourcePath);
    const created = (await readdir(tarballsPath)).filter((name) => !before.has(name));
    if (created.length !== 1 || !created[0]?.endsWith(".tgz")) {
      throw new Error(`${item.name} pack 결과가 하나의 tgz가 아닙니다.`);
    }
    const archive = `tarballs/${String(index).padStart(4, "0")}.tgz`;
    const archivePath = join(options.artifactPath, archive);
    await rename(join(tarballsPath, created[0]), archivePath);
    const size = (await stat(archivePath)).size;
    const sha256 = await sha256File(archivePath);
    const integrity = await npmIntegrityFile(archivePath);
    const artifactPackage = { ...item, archive, integrity, sha256, size };
    await readAndVerifyArchive(options.artifactPath, artifactPackage);
    packages.push(artifactPackage);
  }
  const manifest: PublishArtifactManifest = {
    schemaVersion: 1,
    mode: options.expectedMode,
    lane: options.expectedLane,
    mergeSha: options.expectedMergeSha,
    distTag: options.expectedDistTag,
    packages,
  };
  await writeFile(
    join(options.artifactPath, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return verifyPublishArtifact(options);
}

function versionAtLeast(version: string, minimum: [number, number, number]): boolean {
  const parsed = parseSemver(version);
  if (parsed.prerelease.length > 0) return false;
  const values = [parsed.major, parsed.minor, parsed.patch];
  for (let index = 0; index < values.length; index += 1) {
    if ((values[index] ?? 0) !== minimum[index])
      return (values[index] ?? 0) > (minimum[index] ?? 0);
  }
  return true;
}

export function assertPublishEnvironment(environment: PublishEnvironment): void {
  if (environment.ignoreScripts !== "true" || environment.provenance !== "true") {
    throw new Error("npm publish는 ignore-scripts와 provenance를 강제로 활성화해야 합니다.");
  }
  if (!environment.idTokenUrl || !environment.idTokenToken) {
    throw new Error("npm trusted publishing에 GitHub OIDC 환경이 필요합니다.");
  }
  if (environment.registry !== "https://registry.npmjs.org") {
    throw new Error(
      `npm publish registry가 npmjs exact URL이 아닙니다: ${String(environment.registry)}`,
    );
  }
  if (!versionAtLeast(environment.npmVersion, [11, 5, 1])) {
    throw new Error(`npm 11.5.1 이상이 필요합니다: ${environment.npmVersion}`);
  }
  if (environment.changesetsVersion !== "2.29.7") {
    throw new Error(`검토된 Changesets 2.29.7이 필요합니다: ${environment.changesetsVersion}`);
  }
}

async function installedPackageVersion(packagePath: string, expectedName: string): Promise<string> {
  const value: unknown = JSON.parse(await readFile(packagePath, "utf8"));
  assertObject(value, `${expectedName} package.json`);
  if (value.name !== expectedName || typeof value.version !== "string") {
    throw new Error(`${expectedName} 설치 정보를 읽지 못했습니다.`);
  }
  return value.version;
}

async function installedNpmVersion(): Promise<string> {
  const executable = Bun.which("npm");
  if (!executable) throw new Error("npm executable을 찾지 못했습니다.");
  const target = await realpath(executable);
  return installedPackageVersion(resolve(dirname(target), "../package.json"), "npm");
}

export async function prepareSanitizedChangesetsWorkspace(options: {
  artifactPath: string;
  approvedWorktree: string;
  manifest: PublishArtifactManifest;
  missingNames: ReadonlySet<string>;
}): Promise<{ workspacePath: string; arguments: string[] }> {
  await assertExactWorktree(options.approvedWorktree, options.manifest.mergeSha);
  const workspacePath = await mkdtemp(join(tmpdir(), "seed-release-publish-"));
  await git(workspacePath, ["init", "--initial-branch=seed-release"]);
  await git(workspacePath, [
    "fetch",
    "--no-tags",
    "--depth=1",
    options.approvedWorktree,
    options.manifest.mergeSha,
  ]);
  await git(workspacePath, ["update-ref", "refs/heads/seed-release", options.manifest.mergeSha]);
  await mkdir(join(workspacePath, "packages"));
  await mkdir(join(workspacePath, "tarballs"));
  await mkdir(join(workspacePath, ".changeset"));
  await writeFile(
    join(workspacePath, ".changeset/config.json"),
    `${JSON.stringify(sanitizedChangesetsConfig, null, 2)}\n`,
  );
  await writeFile(
    join(workspacePath, ".npmrc"),
    ["registry=https://registry.npmjs.org", "ignore-scripts=true", "provenance=true", ""].join(
      "\n",
    ),
  );
  const missing = options.manifest.packages.filter((item) => options.missingNames.has(item.name));
  for (const [index, item] of missing.entries()) {
    const packageDirectory = join(workspacePath, "packages", String(index).padStart(4, "0"));
    await mkdir(packageDirectory);
    const archiveName = `${String(index).padStart(4, "0")}.tgz`;
    await copyFile(
      join(options.artifactPath, item.archive),
      join(workspacePath, "tarballs", archiveName),
    );
    await writeFile(
      join(packageDirectory, "package.json"),
      `${JSON.stringify(
        {
          name: item.name,
          version: item.version,
          publishConfig: {
            access: "public",
            directory: `../../tarballs/${archiveName}`,
            registry: "https://registry.npmjs.org",
          },
        },
        null,
        2,
      )}\n`,
    );
  }
  await writeFile(
    join(workspacePath, "package.json"),
    `${JSON.stringify(
      { name: "seed-release-sanitized-publish", private: true, workspaces: ["packages/*"] },
      null,
      2,
    )}\n`,
  );
  if ((await git(workspacePath, ["rev-parse", "HEAD"])) !== options.manifest.mergeSha) {
    throw new Error("sanitized publish Git root의 HEAD가 승인 merge SHA가 아닙니다.");
  }
  const arguments_ = ["publish", "--no-git-tag"];
  if (options.manifest.distTag !== "latest") arguments_.push("--tag", options.manifest.distTag);
  return { workspacePath, arguments: arguments_ };
}

async function publishArtifact(options: VerifyArtifactOptions): Promise<void> {
  const manifest = await verifyPublishArtifact(options);
  const changesetsPackage = resolve(
    import.meta.dir,
    "../../../../node_modules/@changesets/cli/package.json",
  );
  const changesetsVersion = await installedPackageVersion(changesetsPackage, "@changesets/cli");
  assertPublishEnvironment({
    ignoreScripts: process.env.NPM_CONFIG_IGNORE_SCRIPTS,
    provenance: process.env.NPM_CONFIG_PROVENANCE,
    registry: process.env.NPM_CONFIG_REGISTRY,
    idTokenUrl: process.env.ACTIONS_ID_TOKEN_REQUEST_URL,
    idTokenToken: process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN,
    npmVersion: await installedNpmVersion(),
    changesetsVersion,
  });
  const registryUrl = process.env.NPM_REGISTRY_URL ?? "https://registry.npmjs.org";
  const documents = await fetchRegistryDocuments(manifest.packages, { registryUrl });
  const { missing, distTagMismatches, integrityMismatches } = inspectRegistryGitHeads(
    manifest.packages,
    documents,
    manifest.mergeSha,
    manifest.distTag,
  );
  assertExactRegistryDistTags(distTagMismatches);
  assertExactRegistryIntegrities(integrityMismatches);
  const missingNames = new Set(missing.map((item) => item.name));
  if (missingNames.size === 0) {
    console.log("모든 승인 package version이 exact merge gitHead로 이미 게시됐습니다.");
    return;
  }
  const staged = await prepareSanitizedChangesetsWorkspace({
    artifactPath: options.artifactPath,
    approvedWorktree: options.repositoryPath,
    manifest,
    missingNames,
  });
  try {
    const changesetsBin = resolve(
      import.meta.dir,
      "../../../../node_modules/@changesets/cli/bin.js",
    );
    await run(["bun", changesetsBin, ...staged.arguments], staged.workspacePath);
  } finally {
    await rm(staged.workspacePath, { recursive: true, force: true });
  }
}

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function cliOptions(): VerifyArtifactOptions {
  const mode = requiredEnvironment("PUBLISH_MODE");
  if (mode !== "dry-run" && mode !== "production")
    throw new Error("PUBLISH_MODE가 올바르지 않습니다.");
  const lane = requiredEnvironment("PUBLISH_LANE");
  if (!isLaneName(lane)) throw new Error("PUBLISH_LANE이 올바르지 않습니다.");
  return {
    artifactPath: requiredEnvironment("PUBLISH_ARTIFACT_PATH"),
    repositoryPath: process.env.PUBLISH_REPOSITORY_PATH ?? process.cwd(),
    expectedMode: mode,
    expectedLane: lane,
    expectedMergeSha: requiredEnvironment("PUBLISH_MERGE_SHA"),
    expectedDistTag: requiredEnvironment("PUBLISH_DIST_TAG"),
    expectedPackages: parsePlannedPublishPackages(requiredEnvironment("PUBLISH_PACKAGES")),
  };
}

async function main(): Promise<void> {
  const command = Bun.argv[2];
  const options = cliOptions();
  if (command === "build") {
    await buildArtifact(options);
    return;
  }
  if (command === "verify") {
    const manifest = await verifyPublishArtifact(options);
    if (process.env.GITHUB_OUTPUT) {
      await appendFile(
        process.env.GITHUB_OUTPUT,
        `registryPackages=${JSON.stringify(
          manifest.packages.map(({ name, version, integrity }) => ({ name, version, integrity })),
        )}\n`,
      );
    }
    console.log(
      "승인 package artifact의 schema, hash, tar path/type 및 package identity를 검증했습니다.",
    );
    return;
  }
  if (command === "publish") {
    if (options.expectedMode !== "production")
      throw new Error("production artifact만 게시할 수 있습니다.");
    await publishArtifact(options);
    return;
  }
  throw new Error("publish-artifact command는 build, verify 또는 publish여야 합니다.");
}

if (import.meta.main) await main();
