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

  it("web bundle의 Lynx 전용 sp 단위를 거부한다", async () => {
    const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-manifest-"));
    temporaryDirectories.push(root);
    await writeFile(resolve(root, "badge.12345678.web.bundle"), "font-size: 11sp");
    await writeFile(resolve(root, "badge.87654321.lynx.bundle"), "font-size: 11sp");

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
