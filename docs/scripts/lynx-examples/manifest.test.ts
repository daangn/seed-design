import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createManifestFromBundles, verifyPublishedManifest } from "./manifest.js";

const temporaryDirectories: string[] = [];
afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true })));
});

describe("createManifestFromBundles", () => {
  it("같은 컴포넌트의 예제가 검증한 web·lynx bundle 하나를 공유한다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-manifest-"));
    temporaryDirectories.push(root);
    await writeFile(resolve(root, "badge.12345678.web.bundle"), "web");
    await writeFile(resolve(root, "badge.87654321.lynx.bundle"), "lynx");
    const sourcePath = resolve(root, "source.tsx");
    const bundle = {
      web: "/__lynx__/badge.12345678.web.bundle",
      lynx: "/__lynx__/badge.87654321.lynx.bundle",
    };
    expect(
      await createManifestFromBundles(
        [
          { id: "lynx/badge/preview", entryKey: "badge/preview", sourcePath },
          { id: "lynx/badge/size", entryKey: "badge/size", sourcePath },
        ],
        root,
      ),
    ).toEqual({
      schemaVersion: 1,
      examples: { "lynx/badge/preview": bundle, "lynx/badge/size": bundle },
    });
  });
});

describe("verifyPublishedManifest", () => {
  async function publish(root: string) {
    const manifest = `${JSON.stringify({
      schemaVersion: 1,
      examples: {
        "lynx/badge/preview": {
          web: "/__lynx__/badge.1.web.bundle",
          lynx: "/__lynx__/badge.2.lynx.bundle",
        },
      },
    })}\n`;
    await mkdir(resolve(root, "public"));
    for (const file of ["manifest.json", "e2e-manifest.json", "web-core.css"]) {
      await writeFile(resolve(root, "public", file), file === "manifest.json" ? manifest : "{}");
    }
    await writeFile(resolve(root, "public/badge.1.web.bundle"), "web");
    await writeFile(resolve(root, "public/badge.2.lynx.bundle"), "lynx");
    await writeFile(resolve(root, "lynx-manifest.json"), manifest);
  }

  it("복원한 게시 결과가 온전하면 예제 수를 돌려준다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-prebuilt-"));
    temporaryDirectories.push(root);
    await publish(root);

    expect(
      await verifyPublishedManifest(resolve(root, "public"), resolve(root, "lynx-manifest.json")),
    ).toBe(1);
  });

  it("manifest가 가리키는 bundle이 없으면 실패한다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-prebuilt-"));
    temporaryDirectories.push(root);
    await publish(root);
    await rm(resolve(root, "public/badge.2.lynx.bundle"));

    await expect(
      verifyPublishedManifest(resolve(root, "public"), resolve(root, "lynx-manifest.json")),
    ).rejects.toThrow("badge.2.lynx.bundle");
  });

  it("render용 사본이 게시 manifest와 다르면 실패한다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-prebuilt-"));
    temporaryDirectories.push(root);
    await publish(root);
    await writeFile(resolve(root, "lynx-manifest.json"), "{}\n");

    await expect(
      verifyPublishedManifest(resolve(root, "public"), resolve(root, "lynx-manifest.json")),
    ).rejects.toThrow("render용 Lynx manifest가 게시 manifest와 다릅니다");
  });
});
