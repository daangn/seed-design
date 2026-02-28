import { getToolDedupeKey, getToolPolicy } from "@/lib/ai/tool-contract";

export interface AssistantToolItem {
  key: string;
  toolName: string;
  input: Record<string, unknown>;
  state: string;
  output?: unknown;
}

export interface OrderedAssistantToolSections {
  examples: AssistantToolItem[];
  installations: AssistantToolItem[];
  props: AssistantToolItem[];
  others: AssistantToolItem[];
}

function getSafeInput(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object") return {};
  return input as Record<string, unknown>;
}

function getSectionKey(item: AssistantToolItem): string {
  const input = getSafeInput(item.input);
  return getToolDedupeKey(item.toolName, input, item.output, item.key);
}

function dedupe(items: AssistantToolItem[]): AssistantToolItem[] {
  const deduped: AssistantToolItem[] = [];
  const seen = new Set<string>();

  for (const item of items) {
    const key = getSectionKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

export function orderAssistantToolSections(
  items: AssistantToolItem[],
): OrderedAssistantToolSections {
  const examples: AssistantToolItem[] = [];
  const installations: AssistantToolItem[] = [];
  const props: AssistantToolItem[] = [];
  const others: AssistantToolItem[] = [];

  for (const item of items) {
    const section = getToolPolicy(item.toolName).section;

    if (section === "examples") {
      examples.push(item);
      continue;
    }

    if (section === "installations") {
      installations.push(item);
      continue;
    }

    if (section === "props") {
      props.push(item);
      continue;
    }

    others.push(item);
  }

  return {
    examples: dedupe(examples),
    installations: dedupe(installations),
    props: dedupe(props),
    others,
  };
}
