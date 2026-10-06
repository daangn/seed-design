import { expect, it } from "bun:test";
import { needsArchiveFigmaImages } from "../../../docs/lib/archive-source-scope";

it("resolves Figma only for exported React sources in an archive", () => {
  for (const file of [
    "/docs/content/react/components/action-button.mdx",
    "content/react/index.mdx",
    "C:\\docs\\content\\react\\index.mdx",
  ]) {
    expect(needsArchiveFigmaImages("v1.1", file)).toBe(true);
  }
  for (const file of [
    "/docs/content/docs/components/callout.mdx",
    "/docs/content/breeze/index.mdx",
    "/docs/content/react-other/index.mdx",
  ]) {
    expect(needsArchiveFigmaImages("v1.1", file)).toBe(false);
    expect(needsArchiveFigmaImages("", file)).toBe(true);
  }
});

it("does not request removed Figma nodes from unexported legacy guides", async () => {
  const result = Bun.spawn(
    [
      process.execPath,
      "-e",
      `import config from "./source.config.ts"; globalThis.fetch = () => { throw new Error("Unexpected Figma request"); }; const plugin = config.mdxOptions.remarkPlugins.find(p => typeof p === "function" && p.name === "archiveFigmaImages"); const tree = {type:"root",children:[{type:"mdxJsxFlowElement",name:"FigmaImage",attributes:[{type:"mdxJsxAttribute",name:"id",value:"2:90163"}],children:[]}]}; await plugin()(tree, {path:"/docs/content/docs/components/callout.mdx"}); console.log(JSON.stringify(tree));`,
    ],
    {
      cwd: new URL("../../../docs", import.meta.url).pathname,
      env: {
        ...process.env,
        SEED_DOCS_OFFLINE: "0",
        NEXT_PUBLIC_REACT_ARCHIVE_VERSION: "v1.1",
        FIGMA_FILE_KEY: "fixture",
        FIGMA_PERSONAL_ACCESS_TOKEN: "fixture",
      },
      stdout: "pipe",
      stderr: "pipe",
    },
  );
  const output = await new Response(result.stdout).text();
  expect(await result.exited).toBe(0);
  expect(JSON.parse(output).children[0].attributes[0].value).toBe("2:90163");
});
