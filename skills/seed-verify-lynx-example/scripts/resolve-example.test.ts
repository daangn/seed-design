import { afterEach, describe, expect, it } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveLynxExample } from "./resolve-example";

const fixtures: string[] = [];

afterEach(async () => {
  await Promise.all(fixtures.splice(0).map((fixture) => rm(fixture, { recursive: true })));
});

async function createFixture(): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "seed-resolve-lynx-example-"));
  fixtures.push(root);
  await writeFile(join(root, "package.json"), '{"name":"@seed-design/project"}\n');
  return root;
}

async function addEntry(root: string, component: string, scenario: string): Promise<void> {
  const directory = join(root, "docs/examples/lynx", component);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, `${scenario}.tsx`), "export {};\n");
}

describe("seed-verify-lynx-example resolver", () => {
  it("예제 entry를 manifest의 web·native bundle과 연결한다", async () => {
    const root = await createFixture();
    await addEntry(root, "tabs", "layout");
    const publicDirectory = join(root, "docs/public/__lynx__/tabs");
    await mkdir(publicDirectory, { recursive: true });
    await writeFile(join(publicDirectory, "layout.12345678.web.bundle"), "web");
    await writeFile(join(publicDirectory, "layout.87654321.lynx.bundle"), "native");
    await writeFile(
      join(root, "docs/public/__lynx__/manifest.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        examples: {
          "lynx/tabs/layout": {
            web: "/__lynx__/tabs/layout.12345678.web.bundle",
            lynx: "/__lynx__/tabs/layout.87654321.lynx.bundle",
          },
        },
      })}\n`,
    );

    const result = await resolveLynxExample("docs/examples/lynx/tabs/layout.tsx", root);

    expect(result.target).toEqual({
      input: "docs/examples/lynx/tabs/layout.tsx",
      state: "matched",
      id: "lynx/tabs/layout",
      candidates: [],
    });
    expect(result.entry).toEqual({ path: "docs/examples/lynx/tabs/layout.tsx" });
    expect(result.manifest).toEqual({
      path: "docs/public/__lynx__/manifest.json",
      state: "matched",
    });
    expect(result.bundles.web).toEqual({
      state: "ready",
      manifestUrl: "/__lynx__/tabs/layout.12345678.web.bundle",
      path: "docs/public/__lynx__/tabs/layout.12345678.web.bundle",
    });
    expect(result.bundles.native).toEqual({
      state: "ready",
      manifestUrl: "/__lynx__/tabs/layout.87654321.lynx.bundle",
      path: "docs/public/__lynx__/tabs/layout.87654321.lynx.bundle",
    });
    expect(result.build.required).toBe(false);
    expect(result.runtimeEvidence.webLynx).toMatchObject({
      state: "not-collected",
      preparation: "ready",
    });
    expect(result.runtimeEvidence.lynx.staticEvidence).toContain(
      "docs/public/__lynx__/tabs/layout.87654321.lynx.bundle",
    );
  });

  it("컴포넌트에 예제가 여러 개면 하나를 임의로 선택하지 않는다", async () => {
    const root = await createFixture();
    await addEntry(root, "tabs", "layout");
    await addEntry(root, "tabs", "disabled");

    const result = await resolveLynxExample("Tabs", root);

    expect(result.target.state).toBe("ambiguous");
    expect(result.target.id).toBeUndefined();
    expect(result.target.candidates.map(({ id }) => id)).toEqual([
      "lynx/tabs/disabled",
      "lynx/tabs/layout",
    ]);
    expect(result.manifest.state).toBe("not-checked");
    expect(result.build.required).toBeNull();
    expect(result.runtimeEvidence.lynx.preparation).toBe("target-required");
  });

  it("manifest의 web과 native bundle 종류가 뒤바뀌면 invalid로 남긴다", async () => {
    const root = await createFixture();
    await addEntry(root, "tabs", "layout");
    const publicDirectory = join(root, "docs/public/__lynx__/tabs");
    await mkdir(publicDirectory, { recursive: true });
    await writeFile(join(publicDirectory, "layout.web.bundle"), "web");
    await writeFile(join(publicDirectory, "layout.lynx.bundle"), "native");
    await writeFile(
      join(root, "docs/public/__lynx__/manifest.json"),
      `${JSON.stringify({
        schemaVersion: 1,
        examples: {
          "lynx/tabs/layout": {
            web: "/__lynx__/tabs/layout.lynx.bundle",
            lynx: "/__lynx__/tabs/layout.web.bundle",
          },
        },
      })}\n`,
    );

    const result = await resolveLynxExample("lynx/tabs/layout", root);

    expect(result.bundles.web.state).toBe("invalid");
    expect(result.bundles.native.state).toBe("invalid");
    expect(result.build.required).toBe(true);
  });
});
