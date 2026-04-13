import type { Spec } from "@json-render/core";

export interface GenerateUIOptions {
  prompt: string;
  currentSpec?: Spec;
  apiKey?: string;
  model?: string;
  onPartialSpec?: (spec: Spec) => void;
  onText?: (text: string) => void;
}

export interface GenerateUIResult {
  spec: Spec;
  text: string;
}

export interface GenerateSnippetCodeOptions {
  componentName?: string;
}
