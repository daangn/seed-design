import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { jsonBytes, sha256 } from "./contract";
import { publishRootageArchive, publishRootageSnapshot, type PublicVerifier } from "./publisher";
import { createRootageSnapshotVersion } from "./snapshot";
import type { ObjectStore, StoredObject } from "./types";
import { handleRequest, type WorkerEnv } from "./worker";

class MemoryStore implements ObjectStore {
  objects = new Map<string, StoredObject>();

  async get(key: string): Promise<StoredObject | null> {
    return this.objects.get(key) ?? null;
  }

  async putIfAbsent(key: string, bytes: Uint8Array, checksum: string) {
    if (this.objects.has(key)) return { status: "precondition-failed" as const };
    this.objects.set(key, { bytes: bytes.slice(), etag: checksum, sha256: checksum });
    return { status: "created" as const, etag: checksum };
  }

  async putIfMatch(key: string, bytes: Uint8Array, checksum: string, etag: string) {
    if (this.objects.get(key)?.etag !== etag) return { status: "precondition-failed" as const };
    this.objects.set(key, { bytes: bytes.slice(), etag: checksum, sha256: checksum });
    return { status: "created" as const, etag: checksum };
  }

  async list(prefix: string) {
    return [...this.objects.keys()]
      .filter((key) => key.startsWith(prefix))
      .map((key) => ({ key, uploaded: new Date(0) }));
  }

  async delete(key: string): Promise<void> {
    this.objects.delete(key);
  }

  workerEnv(): WorkerEnv {
    return {
      CF_VERSION_METADATA: {
        id: "77777777-7777-7777-7777-777777777777",
        tag: "",
        timestamp: "2026-08-09T00:00:00.000Z",
      },
      ROOTAGE_BUCKET: {
        get: async (key) => {
          const object = this.objects.get(key);
          if (!object) return null;
          return {
            body: new Response(object.bytes.slice().buffer).body!,
            async arrayBuffer() {
              return object.bytes.slice().buffer;
            },
          };
        },
        head: async (key) => (this.objects.has(key) ? {} : null),
      },
    };
  }
}

const temporaryDirectories: string[] = [];
afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true, force: true })),
  );
});

async function tarball(version: string): Promise<Uint8Array> {
  const directory = await mkdtemp(join(tmpdir(), "rootage-publisher-test-"));
  temporaryDirectories.push(directory);
  const generated = join(directory, "package", "__generated__");
  await mkdir(generated, { recursive: true });
  await writeFile(
    join(directory, "package", "package.json"),
    jsonBytes({ name: "@seed-design/rootage-artifacts", version }),
  );
  await writeFile(
    join(generated, "index.json"),
    jsonBytes({ name: "Rootage", version, resources: [{ path: "/color.json" }] }),
  );
  await writeFile(
    join(generated, "index.d.ts"),
    `declare const artifact: {\n  "name": "Rootage";\n  "version": ${JSON.stringify(version)};\n};\nexport default artifact;\n`,
  );
  await writeFile(join(generated, "color.json"), jsonBytes({ orange: "#ff6f0f" }));
  const archive = join(directory, "package.tgz");
  const pack = Bun.spawn(["tar", "-czf", archive, "-C", directory, "package"], {
    stderr: "pipe",
  });
  const stderr = await new Response(pack.stderr).text();
  if ((await pack.exited) !== 0) throw new Error(`fixture tar 생성 실패: ${stderr}`);
  return new Uint8Array(await readFile(archive));
}

function integrity(bytes: Uint8Array): string {
  return `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
}

function workerVerifier(store: MemoryStore): PublicVerifier {
  return async (baseUrl, manifest, alias) => {
    for (const file of manifest.files) {
      const prefix = alias ?? `v${manifest.version}`;
      const response = await handleRequest(
        new Request(`${baseUrl}/rootage/${prefix}${file.path}`),
        store.workerEnv(),
      );
      expect(response.status).toBe(200);
      expect(await sha256(new Uint8Array(await response.arrayBuffer()))).toBe(file.sha256);
    }
  };
}

describe("Rootage publisher offline E2E", () => {
  test("tarball을 immutable store에 게시하고 exact/latest Worker 응답까지 검증한다", async () => {
    const version = "9.0.0";
    const sourceSha = "a".repeat(40);
    const bytes = await tarball(version);
    const npmIntegrity = integrity(bytes);
    const store = new MemoryStore();
    const input = {
      version,
      npmIntegrity,
      sourceSha,
      stable: true,
      publicBaseUrl: "https://offline.test",
    };
    const source = {
      metadata: {
        name: "@seed-design/rootage-artifacts",
        version,
        gitHead: sourceSha,
        dist: { integrity: npmIntegrity, tarball: "https://offline.test/package.tgz" },
      },
      tarball: bytes,
      npmLatestVersion: version,
    };

    const first = await publishRootageArchive(store, input, source, workerVerifier(store));
    expect(first).toMatchObject({ fileCount: 2, pointerBefore: "", pointerAfter: version });
    expect(store.objects.has(`manifests/v${version}.json`)).toBe(true);
    expect(store.objects.has("pointers/stable.json")).toBe(true);

    const retry = await publishRootageArchive(store, input, source, workerVerifier(store));
    expect(retry.reusedManifest).toBe(true);
    expect(retry.pointerBefore).toBe(version);
    expect(retry.pointerAfter).toBe(version);
  });

  test("pkg.pr.new의 exact snapshot tarball을 stable 포인터 없이 게시한다", async () => {
    const sourceSha = "4".repeat(40);
    const version = createRootageSnapshotVersion("123", sourceSha);
    const bytes = await tarball(version);
    const packageShasum = createHash("sha1").update(bytes).digest("hex");
    const store = new MemoryStore();

    const result = await publishRootageSnapshot(
      store,
      {
        version,
        packageUrl: `https://pkg.pr.new/@seed-design/rootage-artifacts@${sourceSha}`,
        packageShasum,
        sourceSha,
        publicBaseUrl: "https://offline.test",
      },
      {
        fetch: async () =>
          new Response(bytes.slice().buffer as ArrayBuffer, {
            headers: {
              "content-length": String(bytes.byteLength),
              "content-type": "application/tar+gzip",
            },
          }),
        publicVerifier: workerVerifier(store),
      },
    );

    expect(result).toMatchObject({ fileCount: 2, pointerBefore: "", pointerAfter: "" });
    expect(store.objects.has(`manifests/v${version}.json`)).toBe(true);
    expect(store.objects.has("pointers/stable.json")).toBe(false);
    const manifest = JSON.parse(
      new TextDecoder().decode(store.objects.get(`manifests/v${version}.json`)!.bytes),
    );
    expect(manifest.gitHead).toBe(sourceSha);
    expect(manifest.npmIntegrity).toBe(integrity(bytes));
  });

  test("snapshot URL, source 결속과 tarball SHA-1 불일치를 거부한다", async () => {
    const sourceSha = "5".repeat(40);
    const version = createRootageSnapshotVersion("124", sourceSha);
    const bytes = await tarball(version);
    const store = new MemoryStore();
    const baseInput = {
      version,
      packageUrl: `https://pkg.pr.new/@seed-design/rootage-artifacts@${sourceSha}`,
      packageShasum: createHash("sha1").update(bytes).digest("hex"),
      sourceSha,
      publicBaseUrl: "https://offline.test",
    };

    await expect(
      publishRootageSnapshot(store, { ...baseInput, packageUrl: "https://attacker.test/a.tgz" }),
    ).rejects.toThrow("허용된 pkg.pr.new");
    await expect(
      publishRootageSnapshot(store, {
        ...baseInput,
        packageUrl: `https://pkg.pr.new/@seed-design/other-package@${sourceSha}`,
      }),
    ).rejects.toThrow("허용된 pkg.pr.new");
    await expect(
      publishRootageSnapshot(store, {
        ...baseInput,
        packageUrl: `https://pkg.pr.new/@seed-design/rootage-artifacts@${"6".repeat(40)}`,
      }),
    ).rejects.toThrow("허용된 pkg.pr.new");
    await expect(
      publishRootageSnapshot(store, { ...baseInput, sourceSha: "6".repeat(40) }),
    ).rejects.toThrow("source SHA");
    await expect(
      publishRootageSnapshot(
        store,
        { ...baseInput, packageShasum: "0".repeat(40) },
        {
          fetch: async () => new Response(bytes.slice().buffer as ArrayBuffer),
        },
      ),
    ).rejects.toThrow("SHA-1");
  });

  test("재시도 중 immutable object 바이트가 다르면 fail-closed다", async () => {
    const version = "9.0.1";
    const sourceSha = "b".repeat(40);
    const bytes = await tarball(version);
    const npmIntegrity = integrity(bytes);
    const store = new MemoryStore();
    const input = {
      version,
      npmIntegrity,
      sourceSha,
      stable: false,
      publicBaseUrl: "https://offline.test",
    };
    const source = {
      metadata: {
        name: "@seed-design/rootage-artifacts",
        version,
        gitHead: sourceSha,
        dist: { integrity: npmIntegrity, tarball: "https://offline.test/package.tgz" },
      },
      tarball: bytes,
    };
    await publishRootageArchive(store, input, source, workerVerifier(store));
    store.objects.set(`versions/v${version}/color.json`, {
      bytes: jsonBytes({ corrupted: true }),
      etag: "corrupt",
    });
    await expect(
      publishRootageArchive(store, input, source, workerVerifier(store)),
    ).rejects.toThrow("불변 R2 객체 충돌");
  });

  test("latest 검증 실패 시 방금 적용한 ETag만 이전 stable 포인터로 되돌린다", async () => {
    const version = "9.1.0";
    const sourceSha = "c".repeat(40);
    const bytes = await tarball(version);
    const npmIntegrity = integrity(bytes);
    const store = new MemoryStore();
    const previousPointer = jsonBytes({
      schemaVersion: 1,
      version: "9.0.0",
      manifestSha256: "d".repeat(64),
      npmIntegrity,
    });
    store.objects.set("pointers/stable.json", {
      bytes: previousPointer,
      etag: "previous-etag",
    });
    const exactVerifier = workerVerifier(store);
    const verifier: PublicVerifier = async (baseUrl, manifest, alias) => {
      if (alias === "latest") throw new Error("edge checksum mismatch");
      await exactVerifier(baseUrl, manifest, alias);
    };

    await expect(
      publishRootageArchive(
        store,
        { version, npmIntegrity, sourceSha, stable: true, publicBaseUrl: "https://offline.test" },
        {
          metadata: {
            name: "@seed-design/rootage-artifacts",
            version,
            gitHead: sourceSha,
            dist: { integrity: npmIntegrity, tarball: "https://offline.test/package.tgz" },
          },
          tarball: bytes,
          npmLatestVersion: version,
        },
        verifier,
      ),
    ).rejects.toThrow("이전 stable 포인터로 자동 rollback했습니다");
    expect(store.objects.get("pointers/stable.json")?.bytes).toEqual(previousPointer);
  });

  test("latest 검증 중 포인터가 다시 바뀌면 concurrent 변경을 덮어쓰지 않는다", async () => {
    const version = "9.2.0";
    const sourceSha = "e".repeat(40);
    const bytes = await tarball(version);
    const npmIntegrity = integrity(bytes);
    const store = new MemoryStore();
    store.objects.set("pointers/stable.json", {
      bytes: jsonBytes({
        schemaVersion: 1,
        version: "9.1.0",
        manifestSha256: "f".repeat(64),
        npmIntegrity,
      }),
      etag: "previous-etag",
    });
    const concurrentPointer = jsonBytes({
      schemaVersion: 1,
      version: "10.0.0",
      manifestSha256: "1".repeat(64),
      npmIntegrity,
    });
    const exactVerifier = workerVerifier(store);
    const verifier: PublicVerifier = async (baseUrl, manifest, alias) => {
      if (alias === "latest") {
        store.objects.set("pointers/stable.json", {
          bytes: concurrentPointer,
          etag: "concurrent-etag",
        });
        throw new Error("edge checksum mismatch");
      }
      await exactVerifier(baseUrl, manifest, alias);
    };

    await expect(
      publishRootageArchive(
        store,
        { version, npmIntegrity, sourceSha, stable: true, publicBaseUrl: "https://offline.test" },
        {
          metadata: {
            name: "@seed-design/rootage-artifacts",
            version,
            gitHead: sourceSha,
            dist: { integrity: npmIntegrity, tarball: "https://offline.test/package.tgz" },
          },
          tarball: bytes,
          npmLatestVersion: version,
        },
        verifier,
      ),
    ).rejects.toThrow("동시에 변경되어 자동 rollback을 거부했습니다");
    expect(store.objects.get("pointers/stable.json")?.bytes).toEqual(concurrentPointer);
  });

  test("최초 stable 포인터는 이전 값이 없으므로 검증 실패 시 임의 삭제하지 않는다", async () => {
    const version = "9.3.0";
    const sourceSha = "2".repeat(40);
    const bytes = await tarball(version);
    const npmIntegrity = integrity(bytes);
    const store = new MemoryStore();
    const exactVerifier = workerVerifier(store);
    const verifier: PublicVerifier = async (baseUrl, manifest, alias) => {
      if (alias === "latest") throw new Error("edge checksum mismatch");
      await exactVerifier(baseUrl, manifest, alias);
    };

    await expect(
      publishRootageArchive(
        store,
        { version, npmIntegrity, sourceSha, stable: true, publicBaseUrl: "https://offline.test" },
        {
          metadata: {
            name: "@seed-design/rootage-artifacts",
            version,
            gitHead: sourceSha,
            dist: { integrity: npmIntegrity, tarball: "https://offline.test/package.tgz" },
          },
          tarball: bytes,
          npmLatestVersion: version,
        },
        verifier,
      ),
    ).rejects.toThrow("이전 stable 포인터가 없어 자동 rollback할 수 없습니다");
    expect(
      JSON.parse(new TextDecoder().decode(store.objects.get("pointers/stable.json")?.bytes))
        .version,
    ).toBe(version);
  });
});
