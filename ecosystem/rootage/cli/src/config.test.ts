import { afterAll, describe, expect, it } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
      config: { "token-ts": { prefix: "searched" } },
      baseDir: path.join(root, "searched"),
    });
  });

  it("treats the directory above .config/ as the base directory", async () => {
    writeFile(
      "dotconfig/.config/rootage.mjs",
      `export default { "token-ts": { prefix: "dotconfig" } };`,
    );

    expect(await loadConfig(undefined, path.join(root, "dotconfig"))).toEqual({
      config: { "token-ts": { prefix: "dotconfig" } },
      baseDir: path.join(root, "dotconfig"),
    });
  });

  it("loads an explicit path relative to the search directory", async () => {
    writeFile(
      "explicit/configs/custom.mjs",
      `export default { "token-ts": { prefix: "explicit" } };`,
    );

    expect(await loadConfig("configs/custom.mjs", path.join(root, "explicit"))).toEqual({
      config: { "token-ts": { prefix: "explicit" } },
      baseDir: path.join(root, "explicit/configs"),
    });
  });

  it("returns an empty config when nothing is found", async () => {
    fs.mkdirSync(path.join(root, "empty"), { recursive: true });

    expect(await loadConfig(undefined, path.join(root, "empty"))).toEqual({
      config: {},
      baseDir: path.join(root, "empty"),
    });
  });

  it("rejects an explicit path that does not exist", async () => {
    await expect(loadConfig("missing.mjs", root)).rejects.toThrow();
  });
});

describe("resolveCommandOptions", () => {
  const baseDir = path.join(root, "pkg");

  it("reads only the command's own key", () => {
    const config = { tailwind4: { prefix: "tw" } };

    expect(resolveCommandOptions({ config, baseDir }, "tailwind4")).toEqual({ prefix: "tw" });
    expect(resolveCommandOptions({ config, baseDir }, "tailwind3-plugin")).toEqual({});
  });

  it("keeps a command's own options", () => {
    const filter = () => true;

    expect(
      resolveCommandOptions(
        { config: { "component-spec": { prefix: "seed", filter } }, baseDir },
        "component-spec",
      ),
    ).toEqual({ prefix: "seed", filter });
  });

  it("resolves a relative generator against the base directory", () => {
    const config = { "token-css": { generator: "./lib/gen.js" } };

    expect(resolveCommandOptions({ config, baseDir }, "token-css").generator).toBe(
      pathToFileURL(path.join(baseDir, "lib/gen.js")).href,
    );
  });

  it("passes a bare generator specifier through", () => {
    const config = { "token-css": { generator: "some-package/generator" } };

    expect(resolveCommandOptions({ config, baseDir }, "token-css").generator).toBe(
      "some-package/generator",
    );
  });
});

describe("generator resolution", () => {
  it("loads the generator relative to the config file, not the working directory", async () => {
    writeFile("project/lib/gen.mjs", `export default () => "generated";`);
    writeFile(
      "project/rootage.config.mjs",
      `export default { "token-css": { generator: "./lib/gen.mjs" } };`,
    );

    const { generator } = resolveCommandOptions(
      await loadConfig("project/rootage.config.mjs", root),
      "token-css",
    );
    if (!generator) throw new Error("generator is not resolved");

    expect((await import(generator)).default()).toBe("generated");
  });
});
