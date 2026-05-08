import { expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { sharedMjs } from "./fixture";

async function importSharedRuntime() {
  const dir = await mkdtemp(join(tmpdir(), "qvism-shared-"));
  const file = join(dir, "shared.mjs");

  try {
    await writeFile(file, sharedMjs, "utf8");
    return await import(pathToFileURL(file).href);
  } finally {
    await rm(dir, { force: true, recursive: true });
  }
}

test("createClassName: matches compound variants by their class name value", async () => {
  const { createClassName } = await importSharedRuntime();

  const className = createClassName(
    "seed-switchmark__thumb",
    { size: "32", checked: true },
    [{ size: 32, checked: true }],
  );

  expect(className).toContain("seed-switchmark__thumb--size_32-checked_true");
});
