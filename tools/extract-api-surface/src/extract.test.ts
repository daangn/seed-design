import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test } from "bun:test";
import { extractSurface } from "./extract";
import { renderSurface } from "./render";

const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const dir of temporaryDirectories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

function writeFiles(root: string, files: Record<string, string>) {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), content);
  }
}

const FIXTURE = {
  "package.json": JSON.stringify({ name: "fixture", private: true, workspaces: ["packages/*"] }),
  "node_modules/ext/package.json": JSON.stringify({ name: "ext", types: "index.d.ts" }),
  "node_modules/ext/index.d.ts":
    "export interface ExternalAttributes { id?: string; hidden?: boolean; title?: string }\n",
  "packages/internal/package.json": JSON.stringify({ name: "@fixture/internal", private: true }),
  "packages/headless/package.json": JSON.stringify({
    name: "@fixture/headless",
    exports: { ".": { types: "./lib/index.d.ts", import: "./lib/index.js" } },
  }),
  "packages/headless/src/index.ts": `import type { ExternalAttributes } from "ext";

export interface HeadlessProps extends Omit<ExternalAttributes, "hidden"> {
  /**
   * Current value.
   * @default "a"
   */
  value?: "b" | "a";
}

export const useHeadless = (props: HeadlessProps) => props.value;
`,
  "packages/styled/package.json": JSON.stringify({
    name: "@fixture/styled",
    bin: { "styled-cli": "./cli.js" },
    exports: {
      ".": { types: "./lib/index.d.ts", import: "./lib/index.js" },
      "./tokens.css": "./tokens.css",
      "./package.json": "./package.json",
    },
  }),
  "packages/styled/src/index.ts": `import type { HeadlessProps } from "@fixture/headless";

export interface ButtonProps extends HeadlessProps {
  tone?: "neutral" | "brand";
}

/** A button. */
export function Button(props: ButtonProps) {
  return props.tone ?? null;
}
Button.displayName = "Button";

export type IconProps = { [K in "icon"]: string };

export const Icon = (props: IconProps) => props.icon;

export * as Group from "./group";
`,
  "packages/styled/src/group.ts": `export { Button as Root, type ButtonProps as RootProps } from "./index";
`,
};

function createFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "extract-api-surface-test-"));
  temporaryDirectories.push(root);
  writeFiles(root, FIXTURE);

  return root;
}

describe("공개 API 표면 추출", () => {
  test("상속한 멤버를 펼치고 선언 패키지를 표시하며 외부 타입은 개수로 압축한다", () => {
    const root = createFixture();

    expect(renderSurface(extractSurface(root))).toBe(`# @fixture/headless

## .
type HeadlessProps
  value?: "a" | "b" | undefined
    // Current value. @default "a"
  ...ext (2)
function useHeadless: (props: HeadlessProps) => "a" | "b" | undefined

# @fixture/styled
bin styled-cli

## .
component Button
  // A button.
  tone?: "brand" | "neutral" | undefined
  value?: "a" | "b" | undefined  [@fixture/headless]
    // Current value. @default "a"
  ...ext (2)
  static displayName: string
type ButtonProps
  tone?: "brand" | "neutral" | undefined
  value?: "a" | "b" | undefined  [@fixture/headless]
    // Current value. @default "a"
  ...ext (2)
namespace Group
alias Group.Root = Button
alias Group.RootProps = ButtonProps
component Icon
  icon: string
type IconProps
  icon: string

## ./tokens.css
asset ./tokens.css
`);
  });

  test("패키지 tsconfig의 paths 별칭과 tsconfig로만 포함된 선언을 해석한다", () => {
    const root = createFixture();
    writeFiles(root, {
      "packages/aliased/package.json": JSON.stringify({
        name: "@fixture/aliased",
        exports: { ".": { types: "./lib/index.d.ts" } },
      }),
      "packages/aliased/tsconfig.json": JSON.stringify({
        compilerOptions: { paths: { "@/*": ["./src/*"] } },
      }),
      "packages/aliased/src/size.ts": 'export type Size = "s" | "m";\n',
      "packages/aliased/src/assets.d.ts":
        'declare module "*.webp" {\n  const src: string;\n  export default src;\n}\n',
      "packages/aliased/src/index.ts": `import type { Size } from "@/size";
import icon from "./icon.webp";

export interface ChipProps {
  size: Size;
  icon: typeof icon;
}
`,
    });

    expect(renderSurface(extractSurface(root, { packages: ["@fixture/aliased"] }))).toBe(
      `# @fixture/aliased

## .
type ChipProps
  icon: string
  size: Size
`,
    );
  });

  test("public 패키지가 아닌 이름을 지정하면 추출을 멈춘다", () => {
    const root = createFixture();

    expect(() =>
      extractSurface(root, { packages: ["@fixture/styled", "@fixture/internal", "@fixture/typo"] }),
    ).toThrow("public 패키지가 아닙니다: @fixture/internal, @fixture/typo");
  });

  test("해석하지 못한 import가 있으면 목록과 함께 추출을 멈춘다", () => {
    const root = createFixture();
    writeFiles(root, {
      "packages/headless/src/index.ts": `import type { Missing } from "missing-lib";\n${FIXTURE["packages/headless/src/index.ts"]}export type Broken = Missing;\n`,
    });

    expect(() => extractSurface(root)).toThrow(
      "해석하지 못한 import가 1개 있어 표면을 정확히 추출할 수 없습니다.\n  missing-lib  (packages/headless/src/index.ts)",
    );
  });

  test("의존성이 설치되지 않은 루트에서는 설치 방법을 함께 알린다", () => {
    const root = createFixture();
    rmSync(path.join(root, "node_modules"), { recursive: true });

    expect(() => extractSurface(root)).toThrow("node_modules가 없습니다");
  });
});
