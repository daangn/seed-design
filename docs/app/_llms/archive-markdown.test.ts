import { expect, it } from "bun:test";
import { archiveMarkdown } from "./archive-markdown";

it("scopes Markdown links and images while preserving installation code", () => {
  const input =
    "[Button](/react/components/button)\n\n![Example](/example.png)\n\n```sh\nbunx seed-design add button --baseUrl https://seed-design.io\n```\n";
  const output = archiveMarkdown(input, "2.0");
  expect(output).toContain("](/react/2.0/components/button)");
  expect(output).toContain("](/react/2.0/_assets/example.png)");
  expect(output).toContain("bunx seed-design add button --baseUrl https://seed-design.io");
  expect(archiveMarkdown(input, "")).toBe(input);
});
