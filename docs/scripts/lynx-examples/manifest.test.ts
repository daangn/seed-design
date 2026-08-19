import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { createManifestFromBundles } from "./manifest.js";

const temporaryDirectories: string[] = [];
afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true })));
});

describe("createManifestFromBundles", () => {
  it("entry별 web·lynx bundle을 검증한다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-manifest-"));
    temporaryDirectories.push(root);
    await mkdir(resolve(root, "badge"));
    await writeFile(resolve(root, "badge/preview.12345678.web.bundle"), "web");
    await writeFile(resolve(root, "badge/preview.87654321.lynx.bundle"), "lynx");
    const sourcePath = resolve(root, "source.tsx");
    expect(
      await createManifestFromBundles(
        [{ id: "lynx/badge/preview", entryKey: "badge/preview", sourcePath }],
        root,
      ),
    ).toEqual({
      schemaVersion: 1,
      examples: {
        "lynx/badge/preview": {
          web: "/__lynx__/badge/preview.12345678.web.bundle",
          lynx: "/__lynx__/badge/preview.87654321.lynx.bundle",
        },
      },
    });
  });

  it("web bundle의 Lynx 전용 sp 단위를 거부한다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-manifest-"));
    temporaryDirectories.push(root);
    await mkdir(resolve(root, "badge"));
    await writeFile(resolve(root, "badge/preview.12345678.web.bundle"), "font-size: 11sp");
    await writeFile(resolve(root, "badge/preview.87654321.lynx.bundle"), "font-size: 11sp");

    await expect(
      createManifestFromBundles(
        [
          {
            id: "lynx/badge/preview",
            entryKey: "badge/preview",
            sourcePath: resolve(root, "source.tsx"),
          },
        ],
        root,
      ),
    ).rejects.toThrow("lynx/badge/preview의 web bundle에 Lynx 전용 단위가 포함되어 있습니다: 11sp");
  });
});
