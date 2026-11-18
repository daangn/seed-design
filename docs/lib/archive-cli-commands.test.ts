import { expect, it } from "bun:test";
import { archiveCliCommands } from "./archive-cli-commands";

it.each([
  "npx",
  "pnpm dlx",
  "yarn dlx",
  "bun x",
  "bunx",
])("scopes %s registry commands only", (runner) => {
  const commands = [
    "add ui:action-button",
    "add-all ui",
    "compat --all",
    "docs react action-button",
  ];
  for (const command of commands) {
    const input = `${runner} @seed-design/cli@latest ${command}`;
    const [name, ...args] = command.split(" ");
    expect(archiveCliCommands(input, "react/v1.2")).toBe(
      `${runner} @seed-design/cli@latest ${name} --baseUrl https://seed-design.io/react/v1.2 ${args.join(" ")}`,
    );
    expect(archiveCliCommands(input, "")).toBe(input);
  }
  expect(archiveCliCommands(`${runner} @seed-design/cli@latest init`, "react/v1.2")).toBe(
    `${runner} @seed-design/cli@latest init`,
  );
});

it("preserves explicit custom sources and version selections", () => {
  for (const option of [
    "--baseUrl https://example.com",
    "-u https://example.com",
    "--baseUrl=https://example.com",
    "--seed-react-version 2",
  ]) {
    const input = `npx @seed-design/cli@latest add ui:action-button ${option}`;
    expect(archiveCliCommands(input, "react/v1.2")).toBe(input);
  }
  expect(archiveCliCommands("const add = () => 1;", "react/v1.2")).toBe("const add = () => 1;");
});

it("updates a legacy registry URL while retaining its explicitly chosen version", () => {
  expect(
    archiveCliCommands(
      "npx @seed-design/cli@latest add --baseUrl https://1-0.seed-design.pages.dev",
      "react/v1.2",
    ),
  ).toBe("npx @seed-design/cli@latest add --baseUrl https://seed-design.io/react/v1.0");
});

it("keeps CLI result examples in the same archived source", () => {
  const input = [
    "│ - docs: https://seed-design.io/react/components/action-button",
    "│ - llms.txt: https://seed-design.io/llms/react/components/action-button.txt",
    "│ - snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/react/ui/action-button.tsx",
  ].join("\n");
  expect(archiveCliCommands(input, "react/v1.2")).toBe(
    [
      "│ - docs: https://seed-design.io/react/v1.2/components/action-button",
      "│ - llms.txt: https://seed-design.io/react/v1.2/llms/react/components/action-button.txt",
      "│ - snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/react/v1.2/docs/registry/react/ui/action-button.tsx",
    ].join("\n"),
  );
  expect(archiveCliCommands(input, "")).toBe(input);
});

it("keeps Lynx CLI commands and result examples in the Lynx archive", () => {
  expect(archiveCliCommands("npx @seed-design/cli@latest add ui:app-bar", "lynx/v0")).toBe(
    "npx @seed-design/cli@latest add --baseUrl https://seed-design.io/lynx/v0 ui:app-bar",
  );
  const input = [
    "│ - docs: https://seed-design.io/lynx/components/app-bar",
    "│ - llms.txt: https://seed-design.io/llms/lynx/components/app-bar.txt",
    "│ - snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/dev/docs/registry/lynx/ui/app-bar.tsx",
    "│ - docs: https://seed-design.io/react/components/action-button",
    "│ - llms.txt: https://seed-design.io/llms/react/components/action-button.txt",
  ].join("\n");
  expect(archiveCliCommands(input, "lynx/v0")).toBe(
    [
      "│ - docs: https://seed-design.io/lynx/v0/components/app-bar",
      "│ - llms.txt: https://seed-design.io/lynx/v0/llms/lynx/components/app-bar.txt",
      "│ - snippet: https://raw.githubusercontent.com/daangn/seed-design/refs/heads/lynx/v0/docs/registry/lynx/ui/app-bar.tsx",
      "│ - docs: https://seed-design.io/react/components/action-button",
      "│ - llms.txt: https://seed-design.io/llms/react/components/action-button.txt",
    ].join("\n"),
  );
});
