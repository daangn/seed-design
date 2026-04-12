import type { Spec } from "@json-render/core";
import type { GenerateSnippetCodeOptions } from "../types";
import { generateCode } from "./snippet-generator";

export function generateSnippetCode(spec: Spec, options?: GenerateSnippetCodeOptions): string {
  const componentName = options?.componentName ?? "GeneratedComponent";
  return generateCode(spec, componentName);
}
