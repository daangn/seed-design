import { afterAll, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { loadConfig, resolveCommandOptions } from "./config";

const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), "rootage-config-")));

function writeFile(relativePath: string, source: string) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, source);

  return filePath;
}

afterAll(() => fs.rmSync(root, { recursive: true, force: true }));

describe("loadConfig", () => {
  it("finds rootage.config.* in the search directory", async () => {
    writeFile(
      "searched/rootage.config.mjs",
      `export default { "token-ts": { prefix: "searched" } };`,
    );

    expect(await loadConfig(undefined, path.join(root, "searched"))).toEqual({
      "token-ts": { prefix: "searched" },
    });
  });

  it("finds .config/rootage.* in the search directory", async () => {
    writeFile(
      "dotconfig/.config/rootage.mjs",
      `export default { "token-ts": { prefix: "dotconfig" } };`,
    );

    expect(await loadConfig(undefined, path.join(root, "dotconfig"))).toEqual({
      "token-ts": { prefix: "dotconfig" },
    });
  });

  it("loads an explicit path relative to the search directory", async () => {
    writeFile(
      "explicit/configs/custom.mjs",
      `export default { "token-ts": { prefix: "explicit" } };`,
    );

    expect(await loadConfig("configs/custom.mjs", path.join(root, "explicit"))).toEqual({
      "token-ts": { prefix: "explicit" },
    });
  });

  it("returns an empty config when nothing is found", async () => {
    fs.mkdirSync(path.join(root, "empty"), { recursive: true });

    expect(await loadConfig(undefined, path.join(root, "empty"))).toEqual({});
  });

  it("rejects an explicit path that does not exist", async () => {
    await expect(loadConfig("missing.mjs", root)).rejects.toThrow();
  });

  it("loads a TypeScript config that imports its generator without an extension", async () => {
    writeFile(
      "source/src/generator.ts",
      `import { suffix } from "./utils/suffix";\nexport default (): string => \`generated\${suffix}\`;`,
    );
    writeFile("source/src/utils/suffix.ts", `export const suffix: string = "!";`);
    writeFile(
      "source/rootage.config.ts",
      `import generator from "./src/generator";\nexport default { "token-css": { generator } };`,
    );

    const { generator } = resolveCommandOptions(
      await loadConfig(undefined, path.join(root, "source")),
      "token-css",
    );

    expect(await generator?.({ tokens: [], tokenCollections: [] }, {})).toBe("generated!");
  });
});

describe("resolveCommandOptions", () => {
  it("reads only the command's own key", () => {
    const config = { tailwind4: { prefix: "tw" } };

    expect(resolveCommandOptions(config, "tailwind4")).toEqual({ prefix: "tw" });
    expect(resolveCommandOptions(config, "tailwind3-plugin")).toEqual({});
  });

  it("keeps a command's own options", () => {
    const filter = () => true;
    const generator = () => "";

    expect(
      resolveCommandOptions({ "component-spec": { prefix: "seed", filter } }, "component-spec"),
    ).toEqual({ prefix: "seed", filter });
    expect(resolveCommandOptions({ "token-css": { generator, ts: true } }, "token-css")).toEqual({
      generator,
      ts: true,
    });
  });
});
