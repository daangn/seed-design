import type { GeneratedFile, RootagePlugin } from "../config";
import type { ModelKind } from "../parser/authoring/types";

export interface JsdocPluginOptions {
  /** rootage 스펙의 kind. 현재 ComponentSpec의 .d.ts만 지원한다. */
  target: Extract<ModelKind, "ComponentSpec">;
  include?: string[];
  exclude?: string[];
  text: string;
  /** `@` 없이 태그 이름만. */
  tag?: string;
}

// 본문을 태그보다 먼저 둔다. 태그가 앞에 오면 TS가 뒤따르는 줄을 전부 태그의
// 부속 텍스트로 파싱해 심볼 documentation이 빈다.
function renderJsdoc(text: string, tag?: string): string {
  const lines = text.split("\n");

  if (tag) {
    lines.push("", `@${tag}`);
  }

  const body = lines.map((line) => (line === "" ? " *" : ` * ${line}`)).join("\n");

  return `/**\n${body}\n */\n`;
}

function matches(options: JsdocPluginOptions, file: GeneratedFile): boolean {
  if (file.kind !== options.target || file.type !== "dts" || file.id === undefined) return false;
  if (options.include && !options.include.includes(file.id)) return false;
  if (options.exclude?.includes(file.id)) return false;

  return true;
}

export function jsdoc(options: JsdocPluginOptions): RootagePlugin {
  if (typeof options?.text !== "string" || options.text === "") {
    throw new Error("jsdoc plugin: `text` must be a non-empty string");
  }
  if (
    options.tag !== undefined &&
    (typeof options.tag !== "string" || options.tag.startsWith("@"))
  ) {
    throw new Error('jsdoc plugin: `tag` must be a tag name without "@"');
  }

  const comment = renderJsdoc(options.text, options.tag);

  return {
    name: "jsdoc",
    transform: (file) => (matches(options, file) ? comment + file.code : undefined),
  };
}
