import { appendFile } from "node:fs/promises";
import { NPM_INTEGRITY_PATTERN, PACKAGE_NAME, VERSION_PATTERN } from "./contract";

const rootageRegistryUrl = "https://registry.npmjs.org/%40seed-design%2Frootage-artifacts";
const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const sourceShaPattern = /^[0-9a-f]{40}$/;

interface PublishedPackage {
  name: string;
  version: string;
}

interface RegistryVersion {
  name?: string;
  version?: string;
  gitHead?: string;
  dist?: { integrity?: string; tarball?: string };
}

type RegistryFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export interface RootageReleaseSelection {
  stable: boolean;
  version: string;
}

interface ResolveIntegrityOptions {
  allowSourceMismatch?: boolean;
  attempts?: number;
  delayMs?: number;
  fetchImpl?: RegistryFetch;
  sleep?: (milliseconds: number) => Promise<void>;
}

interface RootagePackageManifest {
  name?: unknown;
  version?: unknown;
}

class NonRetryableRegistryError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePublishedPackage(value: unknown): PublishedPackage {
  if (!isRecord(value) || typeof value.name !== "string" || typeof value.version !== "string") {
    throw new Error("Changesets publishedPackages 항목의 name/version 형식이 올바르지 않습니다.");
  }
  if (!value.name || !semverPattern.test(value.version)) {
    throw new Error(
      "Changesets publishedPackages 항목의 package 이름 또는 버전이 올바르지 않습니다.",
    );
  }
  return { name: value.name, version: value.version };
}

export function selectRootageRelease(rawPublishedPackages: string): RootageReleaseSelection | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawPublishedPackages || "[]");
  } catch {
    throw new Error("Changesets publishedPackages JSON을 해석할 수 없습니다.");
  }
  if (!Array.isArray(parsed)) {
    throw new Error("Changesets publishedPackages는 배열이어야 합니다.");
  }

  const matches = parsed.map(parsePublishedPackage).filter((item) => item.name === PACKAGE_NAME);
  if (matches.length === 0) return null;
  if (matches.length !== 1) {
    throw new Error("하나의 게시 실행에 Rootage package 항목이 중복되어 있습니다.");
  }

  const version = matches[0]?.version;
  if (!version || !VERSION_PATTERN.test(version)) {
    throw new Error("게시된 Rootage 버전이 Rootage CDN 계약과 맞지 않습니다.");
  }
  return {
    stable: !version.includes("-"),
    version,
  };
}

function validateCandidateManifest(manifest: RootagePackageManifest): RootageReleaseSelection {
  if (manifest.name !== PACKAGE_NAME) {
    throw new Error("Rootage package.json 이름이 올바르지 않습니다.");
  }
  if (typeof manifest.version !== "string" || !VERSION_PATTERN.test(manifest.version)) {
    throw new Error("Rootage package.json 버전이 Rootage CDN 계약과 맞지 않습니다.");
  }
  return {
    stable: !manifest.version.includes("-"),
    version: manifest.version,
  };
}

function validateRegistryVersion(
  metadata: RegistryVersion,
  version: string,
  sourceSha: string,
  allowSourceMismatch: boolean,
): string | null {
  if (metadata.name !== PACKAGE_NAME || metadata.version !== version) {
    throw new NonRetryableRegistryError(
      "npm Rootage metadata의 package identity가 후보와 다릅니다.",
    );
  }
  if (typeof metadata.gitHead !== "string") {
    throw new Error("npm Rootage metadata에 gitHead가 아직 없습니다.");
  }
  if (metadata.gitHead !== sourceSha) {
    if (allowSourceMismatch) return null;
    throw new NonRetryableRegistryError(
      "npm Rootage metadata의 gitHead가 release source SHA와 다릅니다.",
    );
  }
  const integrity = metadata.dist?.integrity ?? "";
  if (!NPM_INTEGRITY_PATTERN.test(integrity)) {
    throw new NonRetryableRegistryError(
      `Rootage ${version}의 npm integrity 형식이 올바르지 않습니다.`,
    );
  }
  const tarball = metadata.dist?.tarball ?? "";
  if (!tarball.startsWith("https://")) {
    throw new NonRetryableRegistryError(
      `Rootage ${version}의 npm tarball URL이 올바르지 않습니다.`,
    );
  }
  return integrity;
}

export async function resolveRootageIntegrity(
  version: string,
  sourceSha: string,
  options: ResolveIntegrityOptions = {},
): Promise<string | null> {
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(`Rootage 버전 형식이 올바르지 않습니다: ${version}`);
  }
  if (!sourceShaPattern.test(sourceSha)) {
    throw new Error("Rootage source SHA는 40자리 소문자 Git SHA여야 합니다.");
  }
  const attempts = options.attempts ?? 12;
  const delayMs = options.delayMs ?? 5_000;
  const fetchImpl = options.fetchImpl ?? fetch;
  const sleep = options.sleep ?? Bun.sleep;
  const allowSourceMismatch = options.allowSourceMismatch ?? false;
  if (!Number.isInteger(attempts) || attempts < 1) {
    throw new Error("npm registry 조회 횟수는 1 이상의 정수여야 합니다.");
  }

  let lastFailure = "응답 없음";
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(`${rootageRegistryUrl}/${encodeURIComponent(version)}`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(15_000),
      });
      if (response.ok) {
        const metadata = (await response.json()) as RegistryVersion;
        return validateRegistryVersion(metadata, version, sourceSha, allowSourceMismatch);
      }
      lastFailure = `HTTP ${response.status}`;
      if (response.status < 500 && response.status !== 404 && response.status !== 429) {
        throw new NonRetryableRegistryError(
          `npm registry가 재시도할 수 없는 응답을 반환했습니다: ${response.status}`,
        );
      }
    } catch (error) {
      if (error instanceof NonRetryableRegistryError) throw error;
      lastFailure = error instanceof Error ? error.message : String(error);
    }
    if (attempt < attempts) await sleep(delayMs);
  }

  throw new Error(`Rootage ${version}의 npm metadata를 확인하지 못했습니다 (${lastFailure}).`);
}

async function writeOutput(values: Record<string, string>): Promise<void> {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) throw new Error("GITHUB_OUTPUT이 설정되지 않았습니다.");
  await appendFile(
    outputPath,
    `${Object.entries(values)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n")}\n`,
  );
}

async function main(): Promise<void> {
  const published = selectRootageRelease(process.env.PUBLISHED_PACKAGES ?? "[]");
  const sourceSha = process.env.ROOTAGE_SOURCE_SHA ?? "";
  const manifest = (await Bun.file(
    "packages/rootage/package.json",
  ).json()) as RootagePackageManifest;
  const candidate = validateCandidateManifest(manifest);
  if (published && published.version !== candidate.version) {
    throw new Error("Changesets 게시 버전과 source의 Rootage package 버전이 다릅니다.");
  }

  const integrity = await resolveRootageIntegrity(candidate.version, sourceSha, {
    allowSourceMismatch: published === null,
  });
  if (!integrity) {
    await writeOutput({ found: "false", integrity: "", stable: "", version: "" });
    return;
  }
  await writeOutput({
    found: "true",
    integrity,
    stable: String(candidate.stable),
    version: candidate.version,
  });
  console.log(`${PACKAGE_NAME}@${candidate.version}: ${integrity}`);
}

if (import.meta.main) await main();
