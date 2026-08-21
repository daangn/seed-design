import { afterEach, describe, expect, it } from "bun:test";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { discoverLynxExamples } from "./discovery.js";

const temporaryDirectories: string[] = [];
afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((path) => rm(path, { recursive: true })));
});

async function fixture() {
  const root = await mkdtemp(resolve(tmpdir(), "seed-lynx-discovery-"));
  temporaryDirectories.push(root);
  return root;
}

describe("discoverLynxExamples", () => {
  it("두 단계 entry를 논리 ID 순서로 찾는다", async () => {
    const root = await fixture();
    await mkdir(resolve(root, "badge"));
    await mkdir(resolve(root, "action-button"));
    await writeFile(resolve(root, "badge/preview.tsx"), "export {};");
    await writeFile(resolve(root, "action-button/preview.tsx"), "export {};");
    expect((await discoverLynxExamples(root)).map(({ id }) => id)).toEqual([
      "lynx/action-button/preview",
      "lynx/badge/preview",
    ]);
  });

  it("symlink entry를 거부한다", async () => {
    const root = await fixture();
    const outside = await fixture();
    await mkdir(resolve(root, "badge"));
    await writeFile(resolve(outside, "preview.tsx"), "export {};");
    await symlink(resolve(outside, "preview.tsx"), resolve(root, "badge/preview.tsx"));
    await expect(discoverLynxExamples(root)).rejects.toThrow("symlink");
  });
});
