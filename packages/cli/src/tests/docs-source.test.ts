import { expect, it } from "bun:test";
import { docsSource } from "../utils/docs-source";

it.each([
  "v1.0",
  "v1.1",
  "v1.2",
  "v2",
])("keeps %s documents, LLMs and snippets in their archive", (version) => {
  const base = `https://seed-design.io/react/${version}`;
  const source = docsSource(`${base}/`);
  expect(source.document("/react/components/action-button")).toBe(
    `${base}/components/action-button`,
  );
  expect(source.document(`/react/${version}/components/action-button`)).toBe(
    `${base}/components/action-button`,
  );
  expect(source.llms("/react/components/action-button")).toBe(
    `${base}/llms/react/components/action-button.txt`,
  );
  expect(source.llms(`/react/${version}/components/action-button`)).toBe(
    `${base}/llms/react/components/action-button.txt`,
  );
  expect(source.llmsIndex("/react/changelog")).toBe(`${base}/llms/react/changelog/llms.txt`);
  expect(source.snippet("react/ui", "action-button.tsx")).toBe(
    `https://raw.githubusercontent.com/daangn/seed-design/refs/heads/react/${version}/docs/registry/react/ui/action-button.tsx`,
  );
});

it("retains latest React, Lynx and custom registry roots", () => {
  for (const base of ["https://seed-design.io", "http://localhost:3000/custom-root"]) {
    const source = docsSource(base);
    expect(source.document("/lynx/components/checkbox")).toBe(`${base}/lynx/components/checkbox`);
    expect(source.llms("/lynx/components/checkbox")).toBe(
      `${base}/llms/lynx/components/checkbox.txt`,
    );
    expect(source.snippet("lynx/ui", "checkbox.tsx")).toContain(
      "/refs/heads/dev/docs/registry/lynx/ui/checkbox.tsx",
    );
  }
});
