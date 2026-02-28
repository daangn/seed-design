import { generateObject, type LanguageModel } from "ai";
import { z } from "zod";
import type { ToolDescriptor } from "./tool-registry";

export type ReasoningMode = "direct" | "tool-planned";

export interface OrchestrationPlan {
  reasoningMode: ReasoningMode;
  toolSequence: string[];
  summary: string;
  shouldAskClarifyingQuestion: boolean;
}

export function shouldUsePlanningStage(input: {
  question: string;
  toolCatalog: ToolDescriptor[];
  isComponentGuide: boolean;
}): boolean {
  const question = input.question.trim().toLowerCase();
  if (!question) return false;
  if (input.isComponentGuide && question.length < 80) return false;

  const multiIntentPattern =
    /(그리고|그다음|또|비교|정리|요약|from|then|also|compare|and\s+then|how\s+to)/i;

  if (question.length >= 90) return true;
  if (multiIntentPattern.test(question)) return true;
  if (input.toolCatalog.length > 6) return true;

  return false;
}

const orchestrationSchema = z.object({
  reasoningMode: z.enum(["direct", "tool-planned"]).default("tool-planned"),
  toolSequence: z.array(z.string()).max(6).default([]),
  summary: z.string().max(300).default(""),
  shouldAskClarifyingQuestion: z.boolean().default(false),
});

function buildCatalogPrompt(toolCatalog: ToolDescriptor[]): string {
  if (toolCatalog.length === 0) return "- (none)";

  return toolCatalog
    .map((toolInfo) => {
      return `- ${toolInfo.name} | capability=${toolInfo.capability} | risk=${toolInfo.risk} | source=${toolInfo.source}`;
    })
    .join("\n");
}

function normalizeToolSequence(sequence: string[], toolCatalog: ToolDescriptor[]): string[] {
  const available = new Set(toolCatalog.map((toolInfo) => toolInfo.name));
  const deduped: string[] = [];
  const seen = new Set<string>();

  for (const name of sequence) {
    if (!available.has(name)) continue;
    if (seen.has(name)) continue;
    deduped.push(name);
    seen.add(name);
  }

  return deduped;
}

function selectFirstByCapability(
  toolCatalog: ToolDescriptor[],
  capability: ToolDescriptor["capability"],
): string | null {
  return toolCatalog.find((toolInfo) => toolInfo.capability === capability)?.name ?? null;
}

function buildHeuristicToolSequence(question: string, toolCatalog: ToolDescriptor[]): string[] {
  const normalized = question.toLowerCase();
  const sequence: string[] = [];

  const install = selectFirstByCapability(toolCatalog, "install");
  const preview = selectFirstByCapability(toolCatalog, "preview");
  const types = selectFirstByCapability(toolCatalog, "types");
  const search = selectFirstByCapability(toolCatalog, "search");
  const fetch = selectFirstByCapability(toolCatalog, "fetch");
  const discover = selectFirstByCapability(toolCatalog, "discover");

  if (/(props|prop|타입|type|interface)/i.test(normalized) && types) {
    sequence.push(types);
    return sequence;
  }

  if (/(설치|installation|install|setup)/i.test(normalized)) {
    if (install) sequence.push(install);
    if (preview) sequence.push(preview);
    return sequence;
  }

  if (/(예시|preview|example|사용법|usage)/i.test(normalized)) {
    if (preview) sequence.push(preview);
    if (install) sequence.push(install);
    return sequence;
  }

  if (search) sequence.push(search);
  if (fetch) sequence.push(fetch);
  if (sequence.length === 0 && discover) sequence.push(discover);

  return sequence;
}

export async function generateOrchestrationPlan(input: {
  question: string;
  toolCatalog: ToolDescriptor[];
  model: LanguageModel;
}): Promise<OrchestrationPlan | null> {
  const question = input.question.trim();
  if (!question) return null;

  try {
    const result = await generateObject({
      model: input.model,
      schema: orchestrationSchema,
      system: `You are selecting the best tool invocation strategy for a chat assistant.
Return a concise sequence of tool names from the provided catalog only.
Prefer minimal tool count and safe tools.
For component setup questions: installation tool first, then preview tool.
For props/type questions: type table tool only.
For broad doc questions: search/discover first, then fetch detail.`,
      prompt: `User question:
${question}

Tool catalog:
${buildCatalogPrompt(input.toolCatalog)}
`,
    });

    const toolSequence = normalizeToolSequence(result.object.toolSequence, input.toolCatalog);
    return {
      reasoningMode: result.object.reasoningMode,
      toolSequence,
      summary: result.object.summary.trim(),
      shouldAskClarifyingQuestion: result.object.shouldAskClarifyingQuestion,
    };
  } catch {
    const heuristicSequence = buildHeuristicToolSequence(question, input.toolCatalog);
    return {
      reasoningMode: "tool-planned",
      toolSequence: heuristicSequence,
      summary: "heuristic fallback",
      shouldAskClarifyingQuestion: false,
    };
  }
}
