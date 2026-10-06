import {
  type ArchiveDefinition,
  archiveOrigin,
  archivePrefix,
  isArchivePath,
  validateArchive,
} from "./config";

export class ArchiveSourceMismatchError extends Error {
  constructor(
    readonly origin: string,
    readonly expectedSha: string,
    readonly actualSha: unknown,
  ) {
    super(
      `${origin}: archive manifest source SHA mismatch (expected ${expectedSha}, received ${String(actualSha)})`,
    );
    this.name = "ArchiveSourceMismatchError";
  }
}

export async function verifyArchive(archive: ArchiveDefinition, fetcher: typeof fetch = fetch) {
  validateArchive(archive);
  const prefix = archivePrefix(archive);
  if (!archive.sourceSha || archive.sourceBranch) {
    throw new Error(`${prefix}: resolve the source branch before verifying its deployment`);
  }
  const origin = archiveOrigin(archive.origin);
  async function get(suffix: string, expectedStatus = 200): Promise<Response> {
    let url = new URL(`${prefix}${suffix}`, origin);
    for (let redirects = 0; redirects <= 5; redirects++) {
      if (url.origin !== origin.origin || !isArchivePath(url.pathname, prefix)) {
        throw new Error(`${prefix}: verification redirect escaped the archive`);
      }
      const response = await fetcher(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(30_000),
      });
      const location = response.headers.get("location");
      if ([301, 302, 303, 307, 308].includes(response.status) && location) {
        await response.body?.cancel();
        url = new URL(location, url);
        continue;
      }
      if (response.status !== expectedStatus) {
        await response.body?.cancel();
        throw new Error(`${prefix}: verification failed: ${suffix} (${response.status})`);
      }
      return response;
    }
    throw new Error(`${prefix}: too many verification redirects`);
  }
  const manifest = await (await get("/archive.json")).json();
  if (
    manifest.platform !== archive.platform ||
    manifest.version !== archive.version ||
    manifest.prefix !== prefix ||
    manifest.sourceDirty !== false
  ) {
    throw new Error(
      `${prefix}: ${origin.origin}: manifest does not match the clean archive (received ${JSON.stringify(manifest)})`,
    );
  }
  if (manifest.sourceSha !== archive.sourceSha)
    throw new ArchiveSourceMismatchError(origin.origin, archive.sourceSha, manifest.sourceSha);
  const html = await (await get("/")).text();
  const canonical = `https://seed-design.io${prefix}`;
  if (!html.includes(`href="${canonical}"`) && !html.includes(`href="${canonical}/"`)) {
    throw new Error(`${prefix}: homepage canonical URL is missing`);
  }
  const script = [...html.matchAll(/src="([^"<>]+)"/g)]
    .map((match) => match[1])
    .find((src) => src.startsWith(`${prefix}/_assets/_next/`) && /\.js(?:\?|$)/.test(src));
  if (!script) throw new Error(`${prefix}: JavaScript path is missing`);
  await (await get(script.slice(prefix.length))).body?.cancel();
  await (await get(`/${archive.probe.document}/`)).body?.cancel();
  await (await get("/api/search")).json();
  await (await get(`/__registry__/${archive.platform}/index.json`)).json();
  await (await get(`/__registry__/${archive.platform}/${archive.probe.registryItem}.json`)).json();
  const index = await (await get("/__docs__/index.json")).json();
  if (index.categories.length !== 1 || index.categories[0].id !== archive.platform) {
    throw new Error(`${prefix}: docs index must contain ${archive.platform} only`);
  }
  await (await get(`/llms/${archive.platform}/${archive.probe.document}.txt`)).body?.cancel();
  await (await get(`/__archive_missing_${crypto.randomUUID()}`, 404)).body?.cancel();
}
